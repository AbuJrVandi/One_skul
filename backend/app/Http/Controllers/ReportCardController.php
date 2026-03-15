<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Student;
use App\Modules\Grades\Models\Grade;
use App\Modules\Terms\Models\Term;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportCardController extends Controller
{
    public function download(Request $request, Student $student, Term $term)
    {
        $school = $student->school;
        
        // Ensure student belongs to school (if logged in as principal)
        // For student/parent dashboard, ensure it's their own report
        
        $school->load(['reportSettings', 'reportAssets']);
        
        $grades = Grade::where('student_id', $student->id)
            ->where('term_id', $term->id)
            ->with(['subject', 'teacher'])
            ->get();
            
        // Attendance summary (Mock for now, or fetch if available)
        // In a real app, we'd have an Attendance model
        $attendance = [
            'total_days' => 60,
            'present' => 58,
            'percentage' => 96.6
        ];

        return Inertia::render('Reports/ReportCardPrint', [
            'school' => $school,
            'student' => $student->load('schoolClass'),
            'term' => $term,
            'grades' => $grades,
            'attendance' => $attendance,
            'principal_comment' => $request->query('comment', 'Outstanding performance this term.')
        ]);
    }

    /**
     * Preview a sample report card for a school (Super Admin use)
     */
    public function preview(Request $request, School $school)
    {
        $school->load(['reportSettings', 'reportAssets']);
        
        // Get settings with defaults
        $settings = $school->reportSettings;
        
        // Create mock student data for preview
        $mockStudent = (object) [
            'id' => 0,
            'first_name' => 'John',
            'last_name' => 'Doe Smith',
            'admission_number' => 'ADM/2025/001',
            'gender' => 'Male',
            'date_of_birth' => '2015-03-15',
            'photo_url' => null,
            'school_class' => (object) [
                'name' => 'Primary 5 Alpha'
            ]
        ];
        
        // Create mock term data
        $mockTerm = (object) [
            'id' => 0,
            'name' => 'First Term',
            'academic_year' => (object) [
                'name' => '2025/2026'
            ]
        ];
        
        // Create mock grades data
        $mockGrades = [
            (object) [
                'id' => 1,
                'subject' => (object) ['name' => 'Mathematics'],
                'score' => 92,
                'grade' => 'A+',
                'remark' => 'Excellent Performance'
            ],
            (object) [
                'id' => 2,
                'subject' => (object) ['name' => 'English Language'],
                'score' => 85,
                'grade' => 'A',
                'remark' => 'Very Good Mastery'
            ],
            (object) [
                'id' => 3,
                'subject' => (object) ['name' => 'Science'],
                'score' => 78,
                'grade' => 'B',
                'remark' => 'Commendable Work'
            ],
            (object) [
                'id' => 4,
                'subject' => (object) ['name' => 'Social Studies'],
                'score' => 88,
                'grade' => 'A',
                'remark' => 'Outstanding Progress'
            ],
            (object) [
                'id' => 5,
                'subject' => (object) ['name' => 'Physical Education'],
                'score' => 95,
                'grade' => 'A+',
                'remark' => 'Exceptional Performance'
            ],
        ];
        
        // Mock attendance
        $attendance = [
            'total_days' => 50,
            'present' => 48,
            'percentage' => 96
        ];
        
        // Principal's comment
        $principalComment = 'An outstanding performance this term. John has shown exceptional growth in leadership.';

        return Inertia::render('Reports/ReportCardPrint', [
            'school' => $school,
            'student' => $mockStudent,
            'term' => $mockTerm,
            'grades' => $mockGrades,
            'attendance' => $attendance,
            'principal_comment' => $principalComment
        ]);
    }
}
