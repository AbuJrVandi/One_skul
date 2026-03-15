<?php

namespace App\Console\Commands;

use App\Models\School;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ProvisionAllSchoolDatabases extends Command
{
    protected $signature = 'school:provision-all {--force : Re-run migrations for all tenant databases}';

    protected $description = 'Provision tenant databases for all schools (manual multi-tenant setup)';

    public function handle(): int
    {
        $schools = School::orderBy('id')->get();

        if ($schools->isEmpty()) {
            $this->info('No schools found.');
            return self::SUCCESS;
        }

        $this->info('Provisioning ' . $schools->count() . ' schools...');

        foreach ($schools as $school) {
            $this->line('-> ' . $school->name . ' (' . ($school->slug ?? $school->id) . ')');
            Artisan::call('school:provision', [
                'school' => $school->id,
                '--force' => $this->option('force'),
            ], $this->output);
        }

        $this->info('All tenant databases provisioned.');

        return self::SUCCESS;
    }
}
