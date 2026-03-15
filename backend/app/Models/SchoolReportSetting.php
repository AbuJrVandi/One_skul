<?php

namespace App\Models;

use App\Models\TenantModel;

class SchoolReportSetting extends TenantModel
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
