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
        
        \Illuminate\Support\Facades\Log::info('Attendance Store Request Initiated', [
            'teacher_id' => $teacher->id, 
            'class_id' => $schoolClass->id,
            'date' => $request->input('date'),
            'records_count' => count($request->input('attendance', []))
        ]);

        if (!$teacher->classes->contains($schoolClass->id)) {
            \Illuminate\Support\Facades\Log::warning('Attendance Store Unauthorized', ['teacher_id' => $teacher->id, 'class_id' => $schoolClass->id]);
            abort(403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late,excused',
            'attendance.*.remarks' => 'nullable|string'
        ]);

        try {
            DB::transaction(function () use ($validated, $schoolClass, $teacher) {
                foreach ($validated['attendance'] as $record) {
                    Attendance::updateOrCreate(
                        [
                            'student_id' => $record['student_id'],
                            'date' => \Carbon\Carbon::parse($validated['date'])->format('Y-m-d'),
                        ],
                        [
                            'school_class_id' => $schoolClass->id,
                            'school_id' => $teacher->school_id,
                            'teacher_id' => $teacher->id,
                            'status' => $record['status'],
                            'remarks' => $record['remarks'] ?? null,
                        ]
                    );
                }
            });

            \Illuminate\Support\Facades\Log::info('Attendance Saved Successfully for Class: ' . $schoolClass->id);
            return redirect()->back()->with('success', 'Attendance records updated successfully.');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Attendance Save Transaction Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->withErrors(['error' => 'Database Failure: ' . $e->getMessage()]);
        }
    }
}
