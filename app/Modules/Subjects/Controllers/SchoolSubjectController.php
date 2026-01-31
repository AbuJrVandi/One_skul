<?php

namespace App\Modules\Subjects\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Modules\Subjects\Models\SchoolSubject;
use App\Modules\Subjects\Models\ClassSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

/**
 * SchoolSubjectController - Principal Subject Management
 * 
 * Handles enabling/disabling subjects for a school
 * and assigning subjects to classes.
 * Only accessible by School Admin (Principal).
 */
class SchoolSubjectController extends Controller
{
    private function getSchool()
    {
        return auth()->user()->school;
    }

    /**
     * Display subjects available to the school
     */
    public function index()
    {
        $school = $this->getSchool();

        // Get all active global subjects with their school-specific status
        $subjects = Subject::where('is_active', true)
            ->orderBy('level')
            ->orderBy('name')
            ->get()
            ->map(function ($subject) use ($school) {
                $schoolSubject = SchoolSubject::where('school_id', $school->id)
                    ->where('subject_id', $subject->id)
                    ->first();

                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'level' => $subject->level,
                    'category' => $subject->category,
                    'is_enabled' => $schoolSubject ? $schoolSubject->is_enabled : true,
                ];
            });

        return Inertia::render('Principal/Subjects/Index', [
            'subjects' => $subjects,
            'levels' => [
                ['value' => 'primary', 'label' => 'Primary'],
                ['value' => 'jss', 'label' => 'Junior Secondary (JSS)'],
                ['value' => 'sss', 'label' => 'Senior Secondary (SSS)'],
                ['value' => 'all', 'label' => 'All Levels'],
            ],
        ]);
    }

    /**
     * Toggle subject enabled/disabled status for the school
     */
    public function toggle(Request $request, Subject $subject)
    {
        $school = $this->getSchool();

        $schoolSubject = SchoolSubject::firstOrCreate(
            [
                'school_id' => $school->id,
                'subject_id' => $subject->id,
            ],
            [
                'is_enabled' => true,
            ]
        );

        $schoolSubject->update([
            'is_enabled' => !$schoolSubject->is_enabled,
        ]);

        $status = $schoolSubject->is_enabled ? 'enabled' : 'disabled';
        return redirect()->back()->with('success', "Subject {$status} for your school.");
    }

    /**
     * Display class-subject assignment page
     */
    public function classAssignment()
    {
        $school = $this->getSchool();

        // Get classes for this school
        $classes = SchoolClass::where('school_id', $school->id)
            ->orderBy('level')
            ->orderBy('name')
            ->get()
            ->map(function ($class) {
                $assignedSubjects = ClassSubject::where('school_class_id', $class->id)
                    ->pluck('subject_id')
                    ->toArray();

                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'level' => $class->level,
                    'assigned_subjects' => $assignedSubjects,
                ];
            });

        // Get enabled subjects for this school
        $subjects = Subject::where('is_active', true)
            ->whereHas('schoolSubjects', function ($query) use ($school) {
                $query->where('school_id', $school->id)
                    ->where('is_enabled', true);
            })
            ->orWhereDoesntHave('schoolSubjects', function ($query) use ($school) {
                $query->where('school_id', $school->id);
            })
            ->where('is_active', true)
            ->orderBy('level')
            ->orderBy('name')
            ->get();

        return Inertia::render('Principal/Subjects/ClassAssignment', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Assign subjects to a class
     */
    public function assignSubjects(Request $request, SchoolClass $schoolClass)
    {
        $school = $this->getSchool();

        // Verify the class belongs to this school
        if ($schoolClass->school_id !== $school->id) {
            abort(403);
        }

        $validated = $request->validate([
            'subject_ids' => 'required|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        DB::transaction(function () use ($schoolClass, $validated) {
            // Remove existing assignments
            ClassSubject::where('school_class_id', $schoolClass->id)->delete();

            // Create new assignments
            foreach ($validated['subject_ids'] as $subjectId) {
                ClassSubject::create([
                    'school_class_id' => $schoolClass->id,
                    'subject_id' => $subjectId,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Subjects assigned to class successfully.');
    }
}
