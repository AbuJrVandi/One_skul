<?php

namespace App\Models;

use App\Models\TenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\Applications\Models\StudentDecisionDocument;

class Student extends TenantModel
{
    protected static function booted()
    {
        static::deleting(function ($student) {
            if ($student->profile_photo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($student->profile_photo_path);
            }
        });
    }

    protected $fillable = [
        'school_id', 
        'first_name', 
        'last_name', 
        'index_number', 
        'date_of_birth', 
        'gender', 
        'grade_level',
        'address',
        'emergency_contact',
        'user_id',
        'photo_path',
        'profile_photo_path',
        'school_class_id',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    public function reportCards(): HasMany
    {
        return $this->hasMany(ReportCard::class);
    }

    public function decisionDocuments(): HasMany
    {
        return $this->hasMany(StudentDecisionDocument::class, 'student_id');
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->profile_photo_path 
            ? asset('storage/' . $this->profile_photo_path) 
            : null;
    }

    protected $appends = ['full_name', 'photo_url'];
}
