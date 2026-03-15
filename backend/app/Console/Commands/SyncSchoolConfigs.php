<?php

namespace App\Console\Commands;

use App\Models\School;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncSchoolConfigs extends Command
{
    protected $signature = 'school:sync-configs {--overwrite : Overwrite existing config values}';

    protected $description = 'Ensure per-school frontend folders and config.json files exist';

    public function handle(): int
    {
        $overwrite = $this->option('overwrite');
        $schools = School::orderBy('id')->get();

        if ($schools->isEmpty()) {
            $this->info('No schools found.');
            return self::SUCCESS;
        }

        foreach ($schools as $school) {
            if (!$school->slug) {
                $school->slug = School::generateUniqueSlug($school->name, $school->id);
                $school->saveQuietly();
            }

            $this->syncForSchool($school, $overwrite);
        }

        $this->info('School configs synced.');
        return self::SUCCESS;
    }

    private function syncForSchool(School $school, bool $overwrite): void
    {
        $basePath = base_path('../frontend/resources/js/Pages/Schools');
        $schoolDir = $basePath . '/' . $school->slug;
        $configPath = $schoolDir . '/config.json';

        if (!File::exists($schoolDir)) {
            File::makeDirectory($schoolDir, 0755, true);
        }

        $defaults = [
            'slug' => $school->slug,
            'brandName' => $school->name,
            'tagline' => '',
            'portal' => [
                'portalLabel' => 'Enter ' . $school->name . ' Portal',
                'applyLabel' => 'Apply to ' . $school->name,
            ],
        ];

        if (!File::exists($configPath)) {
            File::put($configPath, json_encode($defaults, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);
            return;
        }

        $existing = json_decode(File::get($configPath), true) ?: [];

        if ($overwrite) {
            File::put($configPath, json_encode($defaults, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);
            return;
        }

        $merged = $existing;
        $merged['slug'] = $school->slug;
        $merged['brandName'] = $existing['brandName'] ?? $defaults['brandName'];
        $merged['tagline'] = $existing['tagline'] ?? $defaults['tagline'];
        $merged['portal'] = $existing['portal'] ?? [];
        $merged['portal']['portalLabel'] = $merged['portal']['portalLabel'] ?? $defaults['portal']['portalLabel'];
        $merged['portal']['applyLabel'] = $merged['portal']['applyLabel'] ?? $defaults['portal']['applyLabel'];

        File::put($configPath, json_encode($merged, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);
    }
}
