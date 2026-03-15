<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Classes Table
        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g. Class 1, JSS 1, SSS 3
            $table->enum('level', ['primary', 'jss', 'sss']);
            $table->timestamps();
        });

        // 2. Pivot Table for Teachers assigned to Classes
        Schema::create('class_teacher', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The User with role 'teacher'
            $table->timestamps();
        });

        // 3. School Settings
        Schema::create('school_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->string('key');
            $table->text('value')->nullable();
            $table->timestamps();
            $table->unique(['school_id', 'key']);
        });

        // 4. Update Students table to include class_id
        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('school_class_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['school_class_id']);
            $table->dropColumn('school_class_id');
        });
        Schema::dropIfExists('school_settings');
        Schema::dropIfExists('class_teacher');
        Schema::dropIfExists('school_classes');
    }
};
