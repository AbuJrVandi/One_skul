<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CleanupApplicantTempFiles extends Command
{
    protected $signature = 'applicant:cleanup-temp-files {--hours=24 : Delete temp files older than this many hours}';

    protected $description = 'Remove stale applicant upload temp files from storage/app/tmp/applications';

    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        if ($hours <= 0) {
            $this->error('The --hours option must be a positive integer.');
            return self::FAILURE;
        }

        $basePath = storage_path('app/tmp/applications');
        if (!File::exists($basePath)) {
            $this->info('No temp application files to clean.');
            return self::SUCCESS;
        }

        $threshold = now()->subHours($hours)->getTimestamp();
        $deletedFiles = 0;

        foreach (File::allFiles($basePath) as $file) {
            if ($file->getMTime() < $threshold) {
                File::delete($file->getRealPath());
                $deletedFiles++;
            }
        }

        $deletedDirs = 0;
        $dirs = File::allDirectories($basePath);
        usort($dirs, function ($a, $b) {
            return substr_count($b, DIRECTORY_SEPARATOR) <=> substr_count($a, DIRECTORY_SEPARATOR);
        });

        foreach ($dirs as $dir) {
            if (empty(File::files($dir)) && empty(File::directories($dir))) {
                File::deleteDirectory($dir);
                $deletedDirs++;
            }
        }

        $this->info("Deleted {$deletedFiles} file(s) and {$deletedDirs} empty directorie(s).");

        return self::SUCCESS;
    }
}
