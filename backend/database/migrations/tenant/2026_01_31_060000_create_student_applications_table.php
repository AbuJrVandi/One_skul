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
        Schema::create('student_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->string('application_reference')->unique(); // e.g., APP-2024-ABC12
            $table->string('application_pin'); // e.g., 123456
            $table->string('class_category'); // primary, jss, sss
            
            // Core Identity
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable(); 
            $table->string('phone')->nullable();
            
            // Dynamic Data (Structured storage for all form fields)
            $table->json('application_data'); 
            
            // Status Tracking
            $table->string('status')->default('draft'); // draft, submitted, approved, rejected
            $table->timestamp('submitted_at')->nullable();
            
            // Review Details
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['school_id', 'status']);
            $table->index('application_reference');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_applications');
    }
};
