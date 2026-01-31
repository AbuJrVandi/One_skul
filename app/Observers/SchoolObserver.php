<?php

namespace App\Observers;

use App\Models\School;
use App\Models\Subject;
use App\Modules\Subjects\Models\SchoolSubject;

/**
 * SchoolObserver - Handles automatic subject assignment for new schools
 * 
 * When a new school is created, all active global subjects are
 * automatically made available to that school with enabled status.
 */
class SchoolObserver
{
    /**
     * Handle the School "created" event.
     */
    public function created(School $school): void
    {
        // Auto-assign all active subjects to the new school
        $activeSubjects = Subject::where('is_active', true)->get();

        foreach ($activeSubjects as $subject) {
            SchoolSubject::create([
                'school_id' => $school->id,
                'subject_id' => $subject->id,
                'is_enabled' => true,
            ]);
        }
    }
}
