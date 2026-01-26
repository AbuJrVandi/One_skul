<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->with(['school', 'schoolClass'])->first();
        
        $notices = \App\Models\Notice::where('school_id', $student->school_id)
            ->whereIn('target_audience', ['all', 'students'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'school' => $student ? $student->school : null,
            'class' => $student ? $student->schoolClass : null,
            'notices' => $notices
        ]);
    }
}
