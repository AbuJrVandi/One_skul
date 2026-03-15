<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Modules\Attendance\Models\Attendance;
use App\Modules\Grades\Models\Grade;

class TeacherController extends Controller
{
    private function getTeacher()
    {
        return auth()->user();
    }

    private function teacherAssignedToClass(int $teacherId, int $classId): bool
    {
        return DB::connection('tenant')->table('class_teacher')
            ->where('user_id', $teacherId)
            ->where('school_class_id', $classId)
            ->exists();
    }

    public function dashboard()
    {
        $teacher = $this->getTeacher();
        $classes = $teacher->classes()->withCount('students')->get();
        $today = now()->toDateString();

        $attendanceCounts = Attendance::where('teacher_id', $teacher->id)
            ->where('date', $today)
            ->select('school_class_id', DB::raw('count(*) as total'))
            ->groupBy('school_class_id')
            ->pluck('total', 'school_class_id');

        $lastGradeDates = Grade::where('teacher_id', $teacher->id)
            ->select('school_class_id', DB::raw('max(created_at) as last_grade_at'))
            ->groupBy('school_class_id')
            ->pluck('last_grade_at', 'school_class_id');

        $classesPayload = $classes->map(function ($class) use ($attendanceCounts, $lastGradeDates, $today) {
            $attendanceDone = ($attendanceCounts[$class->id] ?? 0) > 0;
            $lastGradeAt = $lastGradeDates[$class->id] ?? null;
            $lastGradeAtDate = $lastGradeAt ? \Carbon\Carbon::parse($lastGradeAt) : null;
            $gradesStale = $lastGradeAtDate ? $lastGradeAtDate->lt(now()->subDays(14)) : true;

            return [
                'id' => $class->id,
                'name' => $class->name,
                'level' => $class->level,
                'students_count' => $class->students_count,
                'attendance_due' => !$attendanceDone,
                'grades_due' => $gradesStale,
                'last_grade_at' => $lastGradeAtDate?->format('M d, Y'),
                'today' => $today,
            ];
        });

        $genderCounts = Student::whereIn('school_class_id', $classes->pluck('id'))
            ->select('gender', DB::raw('count(*) as total'))
            ->groupBy('gender')
            ->pluck('total', 'gender');
        $notices = \App\Models\Notice::where('school_id', $teacher->school_id)
            ->whereIn('target_audience', ['all', 'teachers'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Teacher/Dashboard', [
            'classes' => $classesPayload,
            'notices' => $notices,
            'genderStats' => [
                'male' => (int) ($genderCounts['male'] ?? 0),
                'female' => (int) ($genderCounts['female'] ?? 0),
                'other' => (int) ($genderCounts['other'] ?? 0),
            ],
        ]);
    }

    public function classesIndex()
    {
        $teacher = $this->getTeacher();
        $classes = $teacher->classes()->withCount('students')->get();

        return Inertia::render('Teacher/Classes', [
            'classes' => $classes->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'level' => $class->level,
                    'students_count' => $class->students_count,
                ];
            })->values(),
        ]);
    }

    public function classView($schoolClass)
    {
        $schoolClass = SchoolClass::findOrFail($schoolClass);
        // Security: Ensure teacher is assigned to this class
        if (!$this->teacherAssignedToClass($this->getTeacher()->id, $schoolClass->id)) {
            abort(403);
        }

        return Inertia::render('Teacher/ClassView', [
            'schoolClass' => $schoolClass->load('students'),
            'students' => $schoolClass->students()->latest()->get()
        ]);
    }

    public function studentProfile($student)
    {
        $teacher = $this->getTeacher();
        $student = Student::findOrFail($student);

        if (!$this->teacherAssignedToClass($teacher->id, $student->school_class_id)) {
            abort(403);
        }

        return Inertia::render('Teacher/StudentProfile', [
            'student' => $student->load('schoolClass'),
        ]);
    }
}
