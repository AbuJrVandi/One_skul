<?php

namespace App\Observers;

use App\Models\School;
use App\Models\Subject;
use App\Modules\Subjects\Models\SchoolSubject;
use Illuminate\Support\Facades\File;

/**
 * SchoolObserver - Handles automatic subject assignment for new schools
 * 
 * When a new school is created, all active global subjects are
 * automatically made available to that school with enabled status.
 */
class SchoolObserver
{
    /**
     * Handle the School "created" event.
     */
    public function created(School $school): void
    {
        if (!$school->slug) {
            $school->slug = School::generateUniqueSlug($school->name, $school->id);
            $school->saveQuietly();
        }

        // Auto-assign all active subjects to the new school
        $activeSubjects = Subject::where('is_active', true)->get();

        foreach ($activeSubjects as $subject) {
            SchoolSubject::create([
                'school_id' => $school->id,
                'subject_id' => $subject->id,
                'is_enabled' => true,
            ]);
        }

        $this->ensureFrontendSchoolConfig($school);
    }

    /**
     * Handle the School "updated" event.
     */
    public function updated(School $school): void
    {
        if ($school->wasChanged('slug')) {
            $oldSlug = $school->getOriginal('slug');
            $newSlug = $school->slug;
            $this->renameFrontendSchoolFolder($school, $oldSlug, $newSlug);
            $this->ensureFrontendSchoolConfig($school);
        }
    }

    private function ensureFrontendSchoolConfig(School $school): void
    {
        $basePath = base_path('../frontend/resources/js/Pages/Schools');
        $schoolDir = $basePath . '/' . $school->slug;
        $configPath = $schoolDir . '/config.json';

        if (!File::exists($schoolDir)) {
            File::makeDirectory($schoolDir, 0755, true);
        }

        if (File::exists($configPath)) {
            return;
        }

        $config = [
            'slug' => $school->slug,
            'brandName' => $school->name,
            'tagline' => '',
            'portal' => [
                'portalLabel' => 'Enter ' . $school->name . ' Portal',
                'applyLabel' => 'Apply to ' . $school->name,
            ],
        ];

        File::put($configPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);
    }

    private function renameFrontendSchoolFolder(School $school, ?string $oldSlug, ?string $newSlug): void
    {
        if (!$oldSlug || !$newSlug || $oldSlug === $newSlug) {
            return;
        }

        $basePath = base_path('../frontend/resources/js/Pages/Schools');
        $oldDir = $basePath . '/' . $oldSlug;
        $newDir = $basePath . '/' . $newSlug;

        if (!File::exists($oldDir)) {
            return;
        }

        if (!File::exists($newDir)) {
            File::moveDirectory($oldDir, $newDir);
        }

        $configPath = $newDir . '/config.json';
        if (File::exists($configPath)) {
            $config = json_decode(File::get($configPath), true) ?: [];
            $config['slug'] = $newSlug;
            if (!isset($config['brandName']) || $config['brandName'] === '') {
                $config['brandName'] = $school->name;
            }
            File::put($configPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);
        }
    }
}
