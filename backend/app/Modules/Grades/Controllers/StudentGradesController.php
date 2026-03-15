<?php

namespace App\Modules\Grades\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Grades\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentGradesController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Find student record linked to user
        $student = \App\Models\Student::where('user_id', $user->id)->firstOrFail();
        
        // Fetch grades
        $grades = Grade::where('student_id', $student->id)
            ->with(['subject', 'term', 'teacher'])
            ->orderBy('created_at', 'desc')
            ->get();

        \Illuminate\Support\Facades\Log::info('Student Fetching Grades', [
            'user_id' => $user->id,
            'student_id' => $student->id,
            'count' => $grades->count()
        ]);
            
        return Inertia::render('Student/Grades/Index', [
            'student' => $student,
            'grades' => $grades,
        ]);
    }
}
