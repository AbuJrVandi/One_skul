<?php

namespace App\Console\Commands;

use App\Models\School;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class MigrateAllSchoolData extends Command
{
    protected $signature = 'school:migrate-data-all {--truncate : Clear tenant tables before copying} {--dry-run : Show counts without writing data}';

    protected $description = 'Copy existing data for all schools into their tenant databases';

    public function handle(): int
    {
        $schools = School::orderBy('id')->get();

        if ($schools->isEmpty()) {
            $this->info('No schools found.');
            return self::SUCCESS;
        }

        foreach ($schools as $school) {
            $this->line('-> ' . $school->name . ' (' . ($school->slug ?? $school->id) . ')');
            Artisan::call('school:migrate-data', [
                'school' => $school->id,
                '--truncate' => $this->option('truncate'),
                '--dry-run' => $this->option('dry-run'),
            ], $this->output);
        }

        $this->info('All schools migrated.');
        return self::SUCCESS;
    }
}
