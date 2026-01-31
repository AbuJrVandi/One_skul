<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Subjects\Models\SchoolSubject;

class School extends Model
{
    protected $fillable = [
        'district_id',
        'name',
        'year_founded',
        'school_type',
        'principal_name',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Get school-subject pivot records for this school
     */
    public function schoolSubjects()
    {
        return $this->hasMany(SchoolSubject::class);
    }

    /**
     * Get enabled subjects for this school
     */
    public function enabledSubjects()
    {
        return Subject::active()
            ->whereHas('schoolSubjects', function ($query) {
                $query->where('school_id', $this->id)
                      ->where('is_enabled', true);
            })
            ->orWhereDoesntHave('schoolSubjects', function ($query) {
                $query->where('school_id', $this->id);
            })
            ->where('is_active', true);
    }

    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }
}
