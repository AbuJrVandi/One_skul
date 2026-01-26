<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subject extends Model
{
    protected $fillable = ['name', 'code', 'category', 'is_active'];

    public function schools(): BelongsToMany
    {
        return $this->belongsToMany(School::class);
    }
}
