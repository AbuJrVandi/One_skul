<?php

namespace App\Modules\Grades\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Term;
use App\Modules\Grades\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    private function getTeacher()
    {
        return auth()->user();
    }

    public function index(Request $request, SchoolClass $schoolClass)
    {
        $teacher = $this->getTeacher();

        if (!$teacher->classes->contains($schoolClass->id)) {
            abort(403);
        }

        // Get filter inputs
        $subjectId = $request->input('subject_id');
        $termId = $request->input('term_id');

        // Data for dropdowns - use class-assigned subjects if available, 
        // otherwise fall back to school's enabled subjects
        $subjects = $schoolClass->subjects()->get();
        if ($subjects->isEmpty()) {
            // Fallback: get all active subjects for this level
            $subjects = Subject::active()
                ->forLevel($schoolClass->level)
                ->get();
        }

        // Get active terms only
        $terms = Term::active()->with('academicYear')->get();

        // Load students
        $students = $schoolClass->students()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();
        
        \Illuminate\Support\Facades\Log::info('Grade Index Loaded', [
            'class_id' => $schoolClass->id,
            'student_count' => $students->count(),
            'subject_id' => $subjectId
        ]);

        // Load grades if subject and term selected
        $grades = [];
        if ($subjectId && $termId) {
            $grades = Grade::where('school_class_id', $schoolClass->id)
                ->where('subject_id', $subjectId)
                ->where('term_id', $termId)
                ->get()
                ->keyBy('student_id');
        }

        return Inertia::render('Teacher/Grades/Index', [
            'schoolClass' => $schoolClass,
            'subjects' => $subjects,
            'terms' => $terms,
            'students' => $students,
            'filters' => [
                'subject_id' => $subjectId,
                'term_id' => $termId
            ],
            'existingGrades' => $grades
        ]);
    }

    public function store(Request $request, SchoolClass $schoolClass)
    {
        $teacher = $this->getTeacher();
        
        \Illuminate\Support\Facades\Log::info('Grade Store Request Initiated', [
            'teacher_id' => $teacher->id, 
            'class_id' => $schoolClass->id,
            'payload_sample' => $request->except('grades'), // Log meta, exclude huge grade array
            'grades_count' => count($request->input('grades', []))
        ]);

        if (!$teacher->classes->contains($schoolClass->id)) {
            \Illuminate\Support\Facades\Log::warning('Grade Store Unauthorized', ['teacher_id' => $teacher->id, 'class_id' => $schoolClass->id]);
            abort(403);
        }

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'term_id' => 'required|exists:terms,id',
            'grades' => 'required|array|min:1',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.score' => 'required|numeric|min:0|max:100',
            'grades.*.remarks' => 'nullable|string'
        ]);

        try {
            DB::transaction(function () use ($validated, $schoolClass, $teacher) {
                foreach ($validated['grades'] as $record) {
                    Grade::updateOrCreate(
                        [
                            'student_id' => $record['student_id'],
                            'subject_id' => $validated['subject_id'],
                            'term_id' => $validated['term_id'],
                        ],
                        [
                            'school_class_id' => $schoolClass->id,
                            'school_id' => $teacher->school_id,
                            'teacher_id' => $teacher->id,
                            'score' => $record['score'],
                            'remarks' => $record['remarks'] ?? null,
                        ]
                    );
                }
            });
            
            \Illuminate\Support\Facades\Log::info('Grades Saved Successfully for Class: ' . $schoolClass->id);
            return redirect()->back()->with('success', 'Grades saved successfully.');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Grade Save Transaction Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Expose error for debugging (Production: should hide details, but for this specific debug session we need it)
            return redirect()->back()->withErrors(['error' => 'Database Failure: ' . $e->getMessage()]);
        }
    }
}
