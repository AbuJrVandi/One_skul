<?php

namespace App\Models;

use App\Models\TenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mark extends TenantModel
{
    protected $fillable = [
        'report_card_id',
        'subject_id',
        'continuous_assessment',
        'exam_score',
        'grade',
        'remarks'
    ];

    public function reportCard(): BelongsTo
    {
        return $this->belongsTo(ReportCard::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
