<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Services\TenantManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class DedupeApplicantApplications extends Command
{
    protected $signature = 'applicant:dedupe-applications {--dry-run : Show what would be deleted without making changes}';

    protected $description = 'Remove duplicate applicant applications per school tenant database';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $schools = School::whereNotNull('tenant_db_path')->orderBy('id')->get(['id', 'name', 'slug', 'tenant_db_path']);

        if ($schools->isEmpty()) {
            $this->info('No schools found.');
            return self::SUCCESS;
        }

        $totalDuplicates = 0;

        foreach ($schools as $school) {
            $dbPath = str_starts_with($school->tenant_db_path, '/')
                ? $school->tenant_db_path
                : database_path($school->tenant_db_path);

            if (!File::exists($dbPath)) {
                $this->warn("Skipping {$school->name} (missing tenant DB).");
                continue;
            }

            app(TenantManager::class)->resolveForSchool($school);

            $rows = DB::connection('tenant')
                ->table('student_applications')
                ->select([
                    'id',
                    'school_id',
                    'applicant_user_id',
                    'class_category',
                    'class_level',
                    'first_name',
                    'last_name',
                    'application_reference',
                    'created_at',
                    'submitted_at',
                    DB::raw("json_extract(application_data, '$.date_of_birth') as date_of_birth"),
                ])
                ->whereNotNull('applicant_user_id')
                ->orderBy('created_at')
                ->get();

            if ($rows->isEmpty()) {
                continue;
            }

            $groups = [];
            foreach ($rows as $row) {
                $key = implode('|', [
                    $row->school_id,
                    $row->applicant_user_id,
                    $row->class_category,
                    $row->class_level,
                    $row->first_name,
                    $row->last_name,
                    $row->date_of_birth ?? '',
                ]);

                $groups[$key][] = $row;
            }

            $toDelete = [];
            foreach ($groups as $items) {
                if (count($items) <= 1) {
                    continue;
                }

                // Keep the earliest created application, delete the rest
                array_shift($items);
                foreach ($items as $item) {
                    $toDelete[] = $item;
                }
            }

            if (empty($toDelete)) {
                continue;
            }

            $totalDuplicates += count($toDelete);

            $this->line("{$school->name}: " . count($toDelete) . ' duplicate application(s) found.');

            if ($dryRun) {
                continue;
            }

            $ids = array_map(fn ($item) => $item->id, $toDelete);
            DB::connection('tenant')->table('student_applications')->whereIn('id', $ids)->delete();

            foreach ($toDelete as $item) {
                if (!$item->application_reference) {
                    continue;
                }
                $path = 'applications/' . $school->slug . '/' . $item->application_reference;
                Storage::disk('public')->deleteDirectory($path);
            }
        }

        if ($totalDuplicates === 0) {
            $this->info('No duplicate applications found.');
            return self::SUCCESS;
        }

        $this->info($dryRun
            ? "Dry run complete. {$totalDuplicates} duplicate application(s) would be removed."
            : "Cleanup complete. {$totalDuplicates} duplicate application(s) removed."
        );

        return self::SUCCESS;
    }
}
