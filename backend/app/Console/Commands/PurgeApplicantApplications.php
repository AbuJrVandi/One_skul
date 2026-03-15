<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Services\TenantManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class PurgeApplicantApplications extends Command
{
    protected $signature = 'applicant:purge-applications {--dry-run : Show what would be deleted without making changes}';

    protected $description = 'Delete all applicant-submitted applications across tenant databases';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $schools = School::whereNotNull('tenant_db_path')->orderBy('id')->get(['id', 'name', 'slug', 'tenant_db_path']);

        if ($schools->isEmpty()) {
            $this->info('No schools found.');
            return self::SUCCESS;
        }

        $totalApplications = 0;
        $totalDocuments = 0;

        foreach ($schools as $school) {
            $dbPath = str_starts_with($school->tenant_db_path, '/')
                ? $school->tenant_db_path
                : database_path($school->tenant_db_path);

            if (!File::exists($dbPath)) {
                $this->warn("Skipping {$school->name} (missing tenant DB).");
                continue;
            }

            app(TenantManager::class)->resolveForSchool($school);

            $applications = DB::connection('tenant')
                ->table('student_applications')
                ->select(['id', 'application_reference'])
                ->whereNotNull('applicant_user_id')
                ->get();

            if ($applications->isEmpty()) {
                continue;
            }

            $this->line("{$school->name}: {$applications->count()} applicant application(s) found.");

            $totalApplications += $applications->count();

            if ($dryRun) {
                continue;
            }

            $ids = $applications->pluck('id')->all();
            $references = $applications->pluck('application_reference')->filter()->all();

            $docCount = DB::connection('tenant')
                ->table('student_application_documents')
                ->whereIn('application_id', $ids)
                ->count();

            DB::connection('tenant')->table('student_application_documents')->whereIn('application_id', $ids)->delete();
            DB::connection('tenant')->table('student_applications')->whereIn('id', $ids)->delete();

            $totalDocuments += $docCount;

            foreach ($references as $reference) {
                $path = 'applications/' . $school->slug . '/' . $reference;
                Storage::disk('public')->deleteDirectory($path);
            }
        }

        if ($dryRun) {
            $this->info("Dry run complete. {$totalApplications} applicant application(s) would be deleted.");
            return self::SUCCESS;
        }

        $this->info("Deleted {$totalApplications} applicant application(s) and {$totalDocuments} document record(s).");

        return self::SUCCESS;
    }
}
