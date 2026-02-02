<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolReportAsset extends Model
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
