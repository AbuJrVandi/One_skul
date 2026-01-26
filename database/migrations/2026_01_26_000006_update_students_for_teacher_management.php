<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('photo_path')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Linked login account
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['photo_path', 'address', 'emergency_contact', 'user_id']);
        });
    }
};
