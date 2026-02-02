<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolReportSetting extends Model
{
    protected $fillable = [
        'school_id',
        'custom_school_name',
        'school_motto',
        'principal_name',
        'primary_color',
        'secondary_color',
        'font_style',
        'show_photo',
        'layout_config',
    ];

    protected $casts = [
        'show_photo' => 'boolean',
        'layout_config' => 'array',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
