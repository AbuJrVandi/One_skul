<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('school_subject')) {
            if (!Schema::hasColumn('school_subject', 'is_enabled')) {
                Schema::table('school_subject', function (Blueprint $table) {
                    $table->boolean('is_enabled')->default(true)->after('subject_id');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('school_subject') && Schema::hasColumn('school_subject', 'is_enabled')) {
            Schema::table('school_subject', function (Blueprint $table) {
                $table->dropColumn('is_enabled');
            });
        }
    }
};
