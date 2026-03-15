<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'tenant_db_path')) {
                $table->string('tenant_db_path')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('schools', 'tenant_db_driver')) {
                $table->string('tenant_db_driver')->default('sqlite')->after('tenant_db_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'tenant_db_driver')) {
                $table->dropColumn('tenant_db_driver');
            }
            if (Schema::hasColumn('schools', 'tenant_db_path')) {
                $table->dropColumn('tenant_db_path');
            }
        });
    }
};
