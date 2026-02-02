<?php

namespace App\Modules\Applications\Models;

use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Application extends Model
{
    use HasFactory;

    protected $table = 'student_applications';

    protected $fillable = [
        'school_id',
        'application_reference',
        'application_pin',
        'class_category',
        'class_level',
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
        'generated_email',
        'generated_password',
        'student_id',
        'payment_method',
        'payment_status',
        'payment_at',
    ];

    protected $casts = [
        'application_data' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'payment_at' => 'datetime',
    ];

    // Hide sensitive data from serialization
    protected $hidden = [
        'generated_password',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Scope to find by reference
     */
    public function scopeByReference($query, $reference)
    {
        return $query->where('application_reference', $reference);
    }

    /**
     * Scope for submitted applications only
     */
    public function scopeSubmitted($query)
    {
        return $query->where('status', '!=', 'draft');
    }

    /**
     * Scope for pending applications
     */
    public function scopePending($query)
    {
        return $query->where('status', 'submitted');
    }

    /**
     * Get formatted class category label
     */
    public function getClassCategoryLabelAttribute(): string
    {
        $labels = [
            'primary' => 'Primary (Class 1-6)',
            'jss' => 'Junior Secondary (JSS 1-3)',
            'sss' => 'Senior Secondary (SSS 1-3)',
        ];
        return $labels[$this->class_category] ?? $this->class_category;
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'draft' => 'gray',
            'submitted' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }
}
