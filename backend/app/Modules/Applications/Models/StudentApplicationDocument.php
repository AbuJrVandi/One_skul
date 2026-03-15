<?php

namespace App\Modules\Applications\Models;

use App\Models\TenantModel;

class StudentApplicationDocument extends TenantModel
{
    protected $fillable = [
        'application_id',
        'document_type',
        'file_path',
        'file_size',
        'mime_type',
    ];

    protected $appends = ['url'];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id');
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
