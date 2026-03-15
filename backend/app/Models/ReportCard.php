<?php

namespace App\Models;

use App\Models\TenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportCard extends TenantModel
{
    protected $fillable = [
        'student_id',
        'term_id',
        'total_marks',
        'average',
        'rank',
        'attendance_present',
        'attendance_total',
        'teacher_comment',
        'principal_comment'
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }

    public function marks(): HasMany
    {
        return $this->hasMany(Mark::class);
    }
}
