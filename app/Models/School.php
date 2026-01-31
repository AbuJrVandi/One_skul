<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
