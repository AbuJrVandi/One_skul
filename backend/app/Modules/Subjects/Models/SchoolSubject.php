<?php

namespace App\Modules\Subjects\Models;

use App\Models\TenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\School;
use App\Models\Subject;

/**
 * SchoolSubject - Pivot model for school-subject relationships
 * Tracks which subjects are enabled/disabled per school
 */
class SchoolSubject extends TenantModel
{
    protected $table = 'school_subject';

    protected $fillable = [
        'school_id',
        'subject_id',
        'is_enabled',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
