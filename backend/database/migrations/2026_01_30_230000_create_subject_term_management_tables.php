<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add level to subjects table if not exists
        if (!Schema::hasColumn('subjects', 'level')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->enum('level', ['primary', 'jss', 'sss', 'all'])->default('all')->after('category');
            });
        }

        // Create pivot table for school-subject mapping (enable/disable per school)
        if (!Schema::hasTable('school_subject')) {
            Schema::create('school_subject', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_id')->constrained()->onDelete('cascade');
                $table->foreignId('subject_id')->constrained()->onDelete('cascade');
                $table->boolean('is_enabled')->default(true);
                $table->timestamps();

                $table->unique(['school_id', 'subject_id']);
            });
        }

        // Create pivot table for class-subject assignment
        if (!Schema::hasTable('class_subject')) {
            Schema::create('class_subject', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_class_id')->constrained()->onDelete('cascade');
                $table->foreignId('subject_id')->constrained()->onDelete('cascade');
                $table->timestamps();

                $table->unique(['school_class_id', 'subject_id']);
            });
        }

        // Add is_active to terms table if not exists
        if (!Schema::hasColumn('terms', 'is_active')) {
            Schema::table('terms', function (Blueprint $table) {
                $table->boolean('is_active')->default(true)->after('term_number');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('class_subject');
        Schema::dropIfExists('school_subject');

        if (Schema::hasColumn('subjects', 'level')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->dropColumn('level');
            });
        }

        if (Schema::hasColumn('terms', 'is_active')) {
            Schema::table('terms', function (Blueprint $table) {
                $table->dropColumn('is_active');
            });
        }
    }
};
