<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_applications', function (Blueprint $table) {
            if (!Schema::hasColumn('student_applications', 'applicant_user_id')) {
                $table->unsignedBigInteger('applicant_user_id')->nullable()->after('school_id');
                $table->index('applicant_user_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('student_applications', function (Blueprint $table) {
            if (Schema::hasColumn('student_applications', 'applicant_user_id')) {
                $table->dropIndex(['applicant_user_id']);
                $table->dropColumn('applicant_user_id');
            }
        });
    }
};
