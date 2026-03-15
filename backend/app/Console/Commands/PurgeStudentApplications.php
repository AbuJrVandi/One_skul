<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Services\TenantManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class PurgeStudentApplications extends Command
{
    protected $signature = 'applications:purge {--dry-run : Show what would be deleted without making changes}';

    protected $description = 'Delete all student_applications and related documents from central and tenant databases';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $centralApps = DB::table('student_applications')->count();
        $centralDocs = DB::table('student_application_documents')->count();

        if ($centralApps || $centralDocs) {
            $this->line("Central DB: {$centralApps} application(s), {$centralDocs} document(s).");
            if (!$dryRun) {
                DB::table('student_application_documents')->delete();
                DB::table('student_applications')->delete();
            }
        }

        $schools = School::whereNotNull('tenant_db_path')->orderBy('id')->get(['id', 'name', 'slug', 'tenant_db_path']);

        $tenantAppsTotal = 0;
        $tenantDocsTotal = 0;

        foreach ($schools as $school) {
            $dbPath = str_starts_with($school->tenant_db_path, '/')
                ? $school->tenant_db_path
                : database_path($school->tenant_db_path);

            if (!File::exists($dbPath)) {
                continue;
            }

            app(TenantManager::class)->resolveForSchool($school);

            $apps = DB::connection('tenant')->table('student_applications')->count();
            $docs = DB::connection('tenant')->table('student_application_documents')->count();

            if ($apps === 0 && $docs === 0) {
                continue;
            }

            $tenantAppsTotal += $apps;
            $tenantDocsTotal += $docs;

            $this->line("{$school->name}: {$apps} application(s), {$docs} document(s).");

            if (!$dryRun) {
                DB::connection('tenant')->table('student_application_documents')->delete();
                DB::connection('tenant')->table('student_applications')->delete();
            }

            if (!$dryRun && $school->slug) {
                $path = 'applications/' . $school->slug;
                Storage::disk('public')->deleteDirectory($path);
            }
        }

        if ($dryRun) {
            $this->info("Dry run complete. Central: {$centralApps} apps / {$centralDocs} docs. Tenant: {$tenantAppsTotal} apps / {$tenantDocsTotal} docs.");
            return self::SUCCESS;
        }

        $this->info("Deleted Central: {$centralApps} apps / {$centralDocs} docs. Tenant: {$tenantAppsTotal} apps / {$tenantDocsTotal} docs.");

        return self::SUCCESS;
    }
}
