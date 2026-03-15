<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Services\TenantManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateSchoolData extends Command
{
    protected $signature = 'school:migrate-data {school : School ID or slug} {--truncate : Clear tenant tables before copying} {--dry-run : Show counts without writing data}';

    protected $description = 'Copy existing school data from the central database into the school tenant database';

    public function handle(): int
    {
        $identifier = $this->argument('school');
        $truncate = $this->option('truncate');
        $dryRun = $this->option('dry-run');

        $school = School::query()
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->with('district')
            ->first();

        if (!$school) {
            $this->error('School not found. Provide a valid ID or slug.');
            return self::FAILURE;
        }

        if (!$school->tenant_db_path) {
            $this->error('Tenant database not configured. Run: php artisan school:provision ' . ($school->slug ?? $school->id));
            return self::FAILURE;
        }

        $tenantManager = app(TenantManager::class);
        $tenantManager->resolveForSchool($school);

        $central = DB::connection();
        $tenant = DB::connection('tenant');

        $classIds = $central->table('school_classes')->where('school_id', $school->id)->pluck('id')->all();
        $studentIds = $central->table('students')->where('school_id', $school->id)->pluck('id')->all();
        $reportCardIds = $studentIds
            ? $central->table('report_cards')->whereIn('student_id', $studentIds)->pluck('id')->all()
            : [];

        $tables = [
            'districts' => $central->table('districts')->where('id', $school->district_id)->get(),
            'schools' => $central->table('schools')->where('id', $school->id)->get(),
            'users' => $central->table('users')->where('school_id', $school->id)->get(),
            'academic_years' => $central->table('academic_years')->get(),
            'terms' => $central->table('terms')->get(),
            'subjects' => $central->table('subjects')->get(),
            'school_settings' => $central->table('school_settings')->where('school_id', $school->id)->get(),
            'school_classes' => $central->table('school_classes')->where('school_id', $school->id)->get(),
            'students' => $central->table('students')->where('school_id', $school->id)->get(),
            'school_subject' => $central->table('school_subject')->where('school_id', $school->id)->get(),
            'class_teacher' => $classIds ? $central->table('class_teacher')->whereIn('school_class_id', $classIds)->get() : collect(),
            'class_subject' => $classIds ? $central->table('class_subject')->whereIn('school_class_id', $classIds)->get() : collect(),
            'student_applications' => $central->table('student_applications')->where('school_id', $school->id)->get(),
            'applications' => $central->table('applications')->where('school_id', $school->id)->get(),
            'attendances' => $central->table('attendances')->where('school_id', $school->id)->get(),
            'grades' => $central->table('grades')->where('school_id', $school->id)->get(),
            'report_cards' => $studentIds ? $central->table('report_cards')->whereIn('student_id', $studentIds)->get() : collect(),
            'report_cards_generated' => $studentIds ? $central->table('report_cards_generated')->whereIn('student_id', $studentIds)->get() : collect(),
            'marks' => $reportCardIds ? $central->table('marks')->whereIn('report_card_id', $reportCardIds)->get() : collect(),
            'notices' => $central->table('notices')->where('school_id', $school->id)->get(),
            'school_report_settings' => $central->table('school_report_settings')->where('school_id', $school->id)->get(),
            'school_report_assets' => $central->table('school_report_assets')->where('school_id', $school->id)->get(),
            'school_profile_photos' => $central->table('school_profile_photos')->where('school_id', $school->id)->get(),
        ];

        $tableOrder = array_keys($tables);

        if ($dryRun) {
            foreach ($tables as $table => $rows) {
                $this->line($table . ': ' . $rows->count());
            }
            return self::SUCCESS;
        }

        if ($truncate) {
            $tenant->statement('PRAGMA foreign_keys = OFF');
            foreach (array_reverse($tableOrder) as $table) {
                $tenant->table($table)->delete();
            }
            $tenant->statement('PRAGMA foreign_keys = ON');
        }

        foreach ($tables as $table => $rows) {
            $this->syncTable($tenant, $table, $rows);
        }

        $this->info('Migration complete for ' . $school->name . '.');

        return self::SUCCESS;
    }

    private function syncTable($tenant, string $table, $rows): void
    {
        foreach ($rows as $row) {
            $data = (array) $row;
            if (isset($data['id'])) {
                $tenant->table($table)->updateOrInsert(['id' => $data['id']], $data);
            } else {
                $tenant->table($table)->insert($data);
            }
        }
    }
}
