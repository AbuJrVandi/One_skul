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
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'levels')) {
                $table->json('levels')->nullable()->after('school_type');
            }
            if (!Schema::hasColumn('schools', 'faculties')) {
                $table->json('faculties')->nullable()->after('levels');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'levels')) {
                $table->dropColumn('levels');
            }
            if (Schema::hasColumn('schools', 'faculties')) {
                $table->dropColumn('faculties');
            }
        });
    }
};
