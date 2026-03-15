<?php

namespace App\Console\Commands;

use App\Models\School;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProvisionSchoolDatabase extends Command
{
    protected $signature = 'school:provision {school : School ID or slug} {--force : Re-run migrations even if the database exists}';

    protected $description = 'Provision a dedicated tenant database for a school (manual multi-tenant setup)';

    public function handle(): int
    {
        $identifier = $this->argument('school');

        $school = School::query()
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->with('district')
            ->first();

        if (!$school) {
            $this->error('School not found. Provide a valid ID or slug.');
            return self::FAILURE;
        }

        if (!$school->slug) {
            $school->slug = School::generateUniqueSlug($school->name, $school->id);
        }

        if (!$school->tenant_db_driver) {
            $school->tenant_db_driver = 'sqlite';
        }

        if ($school->tenant_db_driver !== 'sqlite') {
            $this->error('Only sqlite tenant databases are supported by this command.');
            return self::FAILURE;
        }

        if (!$school->tenant_db_path) {
            $school->tenant_db_path = 'tenants/' . $school->slug . '.sqlite';
        }

        $school->save();

        $dbPath = $this->resolveDatabasePath($school->tenant_db_path);
        $dbDir = dirname($dbPath);

        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }

        if (!file_exists($dbPath)) {
            touch($dbPath);
        }

        $this->configureTenantConnection($dbPath);

        $this->info('Running tenant migrations...');

        Artisan::call('migrate', [
            '--path' => 'database/migrations/tenant',
            '--database' => 'tenant',
            '--force' => true,
        ], $this->output);

        $this->seedTenantSchool($school);

        $this->info('Tenant database provisioned successfully.');
        $this->line('Database: ' . $dbPath);

        return self::SUCCESS;
    }

    private function resolveDatabasePath(string $path): string
    {
        if (Str::startsWith($path, ['/','\\'])) {
            return $path;
        }

        return database_path($path);
    }

    private function configureTenantConnection(string $dbPath): void
    {
        config([
            'database.connections.tenant' => [
                'driver' => 'sqlite',
                'database' => $dbPath,
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);

        DB::purge('tenant');
        DB::reconnect('tenant');
    }

    private function seedTenantSchool(School $school): void
    {
        $district = $school->district;
        $now = now();

        if ($district) {
            DB::connection('tenant')->table('districts')->updateOrInsert(
                ['id' => $district->id],
                [
                    'name' => $district->name,
                    'created_at' => $district->created_at ?? $now,
                    'updated_at' => $now,
                ]
            );
        }

        DB::connection('tenant')->table('schools')->updateOrInsert(
            ['id' => $school->id],
            [
                'district_id' => $district?->id,
                'name' => $school->name,
                'slug' => $school->slug,
                'tenant_db_path' => $school->tenant_db_path,
                'tenant_db_driver' => $school->tenant_db_driver,
                'year_founded' => $school->year_founded,
                'school_type' => $school->school_type,
                'principal_name' => $school->principal_name,
                'levels' => $school->levels ? json_encode($school->levels) : null,
                'faculties' => $school->faculties ? json_encode($school->faculties) : null,
                'is_approved' => $school->is_approved,
                'created_at' => $school->created_at ?? $now,
                'updated_at' => $now,
            ]
        );
    }
}
