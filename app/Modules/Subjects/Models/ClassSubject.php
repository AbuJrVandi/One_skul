<?php

namespace App\Modules\Subjects\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\SchoolClass;
use App\Models\Subject;

/**
 * ClassSubject - Pivot model for class-subject assignments
 * Tracks which subjects are assigned to which classes
 */
class ClassSubject extends Model
{
    protected $table = 'class_subject';

    protected $fillable = [
        'school_class_id',
        'subject_id',
    ];

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
