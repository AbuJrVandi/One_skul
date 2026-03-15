<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_report_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('custom_school_name')->nullable();
            $table->string('primary_color')->default('#000000');
            $table->string('secondary_color')->default('#ffffff');
            $table->string('font_style')->default('Inter');
            $table->boolean('show_photo')->default(true);
            $table->json('layout_config')->nullable(); // Positions for photo, grades, attendance, signature
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_report_settings');
    }
};
