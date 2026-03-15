<?php

namespace App\Models;

use App\Models\TenantModel;

class SchoolProfilePhoto extends TenantModel
{
    protected $fillable = [
        'school_id',
        'file_path',
        'caption',
    ];

    protected $appends = ['url'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
