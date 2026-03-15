<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Services\TenantManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PurgeApplicationDocuments extends Command
{
    protected $signature = 'applicant:purge-application-documents {--dry-run : Show what would be deleted without making changes}';

    protected $description = 'Delete all student_application_documents records from central and tenant databases';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $centralCount = DB::table('student_application_documents')->count();
        if ($centralCount > 0) {
            $this->line("Central DB: {$centralCount} document record(s) found.");
            if (!$dryRun) {
                DB::table('student_application_documents')->delete();
            }
        }

        $schools = School::whereNotNull('tenant_db_path')->orderBy('id')->get(['id', 'name', 'tenant_db_path']);

        $tenantTotal = 0;

        foreach ($schools as $school) {
            $dbPath = str_starts_with($school->tenant_db_path, '/')
                ? $school->tenant_db_path
                : database_path($school->tenant_db_path);

            if (!File::exists($dbPath)) {
                continue;
            }

            app(TenantManager::class)->resolveForSchool($school);

            $count = DB::connection('tenant')->table('student_application_documents')->count();
            if ($count === 0) {
                continue;
            }

            $tenantTotal += $count;
            $this->line("{$school->name}: {$count} document record(s) found.");

            if (!$dryRun) {
                DB::connection('tenant')->table('student_application_documents')->delete();
            }
        }

        if ($dryRun) {
            $this->info("Dry run complete. {$centralCount} central + {$tenantTotal} tenant document record(s) would be deleted.");
            return self::SUCCESS;
        }

        $this->info("Deleted {$centralCount} central + {$tenantTotal} tenant document record(s).");
        return self::SUCCESS;
    }
}
