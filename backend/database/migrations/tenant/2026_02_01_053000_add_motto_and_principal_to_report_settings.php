<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('school_report_settings', function (Blueprint $table) {
            $table->string('school_motto')->nullable()->after('custom_school_name');
            $table->string('principal_name')->nullable()->after('school_motto');
        });
    }

    public function down(): void
    {
        Schema::table('school_report_settings', function (Blueprint $table) {
            $table->dropColumn(['school_motto', 'principal_name']);
        });
    }
};
