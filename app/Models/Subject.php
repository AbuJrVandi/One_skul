<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\Subjects\Models\SchoolSubject;
use App\Modules\Subjects\Models\ClassSubject;

class Subject extends Model
{
    protected $fillable = ['name', 'code', 'category', 'level', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function schools(): BelongsToMany
    {
        return $this->belongsToMany(School::class);
    }

    /**
     * Get school-subject pivot records for this subject
     */
    public function schoolSubjects(): HasMany
    {
        return $this->hasMany(SchoolSubject::class);
    }

    /**
     * Get class-subject assignments for this subject
     */
    public function classSubjects(): HasMany
    {
        return $this->hasMany(ClassSubject::class);
    }

    /**
     * Get classes that have this subject assigned
     */
    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class, 'class_subject');
    }

    /**
     * Scope to only active subjects
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by level
     */
    public function scopeForLevel($query, $level)
    {
        return $query->where(function ($q) use ($level) {
            $q->where('level', $level)
              ->orWhere('level', 'all');
        });
    }
}
