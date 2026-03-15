<?php

namespace App\Modules\Applications\Models;

use App\Models\Student;
use App\Models\TenantModel;

class StudentDecisionDocument extends TenantModel
{
    protected $fillable = [
        'application_id',
        'student_id',
        'decision',
        'document_id',
        'verification_code',
        'admission_reference',
        'file_path',
        'file_size',
        'mime_type',
        'generated_by',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
