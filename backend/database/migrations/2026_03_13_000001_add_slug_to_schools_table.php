<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'slug')) {
                $table->string('slug')->nullable()->unique()->after('name');
            }
        });

        // Backfill slugs for existing schools.
        $schools = DB::table('schools')->select('id', 'name', 'slug')->orderBy('id')->get();
        $used = [];

        foreach ($schools as $school) {
            if (!empty($school->slug)) {
                $used[$school->slug] = true;
                continue;
            }

            $base = Str::slug($school->name);
            $slug = $base !== '' ? $base : 'school-' . $school->id;
            $counter = 2;

            while (isset($used[$slug])) {
                $slug = $base . '-' . $counter;
                $counter++;
            }

            DB::table('schools')->where('id', $school->id)->update(['slug' => $slug]);
            $used[$slug] = true;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'slug')) {
                $table->dropUnique(['slug']);
                $table->dropColumn('slug');
            }
        });
    }
};
