<?php

namespace App\Models;

use App\Models\TenantModel;

class SchoolReportAsset extends TenantModel
{
    protected $fillable = [
        'school_id',
        'asset_type',
        'file_path',
        'mime_type',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
