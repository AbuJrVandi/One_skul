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
        Schema::table('student_applications', function (Blueprint $table) {
            // Store generated credentials when approved
            $table->string('generated_email')->nullable()->after('rejection_reason');
            $table->string('generated_password')->nullable()->after('generated_email');
            
            // Link to created student record
            $table->foreignId('student_id')->nullable()->after('generated_password')->constrained('students')->nullOnDelete();
            
            // Payment tracking
            $table->string('payment_method')->nullable()->after('student_id');
            $table->string('payment_status')->default('pending')->after('payment_method');
            $table->timestamp('payment_at')->nullable()->after('payment_status');
            
            // Add specific class level (e.g., "Class 1", "JSS 2", "SSS 3")
            $table->string('class_level')->nullable()->after('class_category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_applications', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropColumn([
                'generated_email',
                'generated_password',
                'student_id',
                'payment_method',
                'payment_status',
                'payment_at',
                'class_level'
            ]);
        });
    }
};
