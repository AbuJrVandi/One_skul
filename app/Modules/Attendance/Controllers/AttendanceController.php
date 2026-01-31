<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Modules\Attendance\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    private function getTeacher()
    {
        return auth()->user();
    }

    public function index(Request $request, SchoolClass $schoolClass)
    {
        $teacher = $this->getTeacher();

        // Security: Teacher must belong to the class
        // Note: The correct relationship check depends on how it is defined in User model.
        // Assuming user->classes() exists based on TeacherController logic
        if (!$teacher->classes->contains($schoolClass->id)) {
            abort(403, 'Unauthorized access to this class.');
        }

        $date = $request->input('date', now()->format('Y-m-d'));

        // Load students
        $students = $schoolClass->students()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        // Load existing attendance for this date
        $attendance = Attendance::where('school_class_id', $schoolClass->id)
            ->where('date', $date)
            ->get()
            ->keyBy('student_id');

        return Inertia::render('Teacher/Attendance/Index', [
            'schoolClass' => $schoolClass,
            'students' => $students,
            'date' => $date,
            'attendanceData' => $attendance,
            'stats' => [
                'total' => $students->count(),
                'present' => $attendance->where('status', 'present')->count(),
                'absent' => $attendance->where('status', 'absent')->count(),
                'late' => $attendance->where('status', 'late')->count(),
            ]
        ]);
    }

    public function store(Request $request, SchoolClass $schoolClass)
    {
        $teacher = $this->getTeacher();
        
        if (!$teacher->classes->contains($schoolClass->id)) {
            abort(403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late,excused',
            'attendance.*.remarks' => 'nullable|string'
        ]);

        DB::transaction(function () use ($validated, $schoolClass, $teacher) {
            foreach ($validated['attendance'] as $record) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $record['student_id'],
                        'date' => $validated['date'],
                        'school_class_id' => $schoolClass->id,
                    ],
                    [
                        'school_id' => $teacher->school_id,
                        'teacher_id' => $teacher->id,
                        'status' => $record['status'],
                        'remarks' => $record['remarks'] ?? null,
                    ]
                );
            }
        });

        return redirect()->back()->with('success', 'Attendance records updated successfully.');
    }
}
