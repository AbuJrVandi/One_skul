<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Attendance\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Find student record linked to user
        $student = \App\Models\Student::where('user_id', $user->id)->firstOrFail();
        
        // Fetch attendance
        $attendance = Attendance::where('student_id', $student->id)
            ->with(['schoolClass', 'teacher'])
            ->orderBy('date', 'desc')
            ->get();
            
        // Simple stats
        $stats = [
            'present' => $attendance->where('status', 'present')->count(),
            'absent' => $attendance->where('status', 'absent')->count(),
            'late' => $attendance->where('status', 'late')->count(),
            'total' => $attendance->count(),
        ];

        return Inertia::render('Student/Attendance/Index', [
            'student' => $student,
            'attendance' => $attendance,
            'stats' => $stats
        ]);
    }
}
