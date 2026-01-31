<?php

namespace App\Modules\Applications\Models;

use App\Models\School;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    protected $table = 'student_applications';

    protected $fillable = [
        'school_id',
        'application_reference',
        'application_pin',
        'class_category',
        'first_name',
        'last_name',
        'email',
        'phone',
        'application_data',
        'status',
        'submitted_at',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = [
        'application_data' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope to find by reference
     */
    public function scopeByReference($query, $reference)
    {
        return $query->where('application_reference', $reference);
    }
}
