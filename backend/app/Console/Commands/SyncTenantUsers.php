<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Models\User;
use App\Services\TenantUserSyncService;
use Illuminate\Console\Command;

class SyncTenantUsers extends Command
{
    protected $signature = 'tenant:sync-users {--school= : School slug or ID}';

    protected $description = 'Sync central users into their tenant databases for FK integrity.';

    public function handle(): int
    {
        $schoolFilter = $this->option('school');

        $schools = School::query()
            ->when($schoolFilter, function ($query) use ($schoolFilter) {
                $query->where('id', $schoolFilter)->orWhere('slug', $schoolFilter);
            })
            ->get();

        if ($schools->isEmpty()) {
            $this->error('No schools found.');
            return self::FAILURE;
        }

        $syncer = app(TenantUserSyncService::class);

        foreach ($schools as $school) {
            $this->info("Syncing users for school: {$school->name} ({$school->slug})");

            $users = User::where('school_id', $school->id)->get();
            $count = 0;

            foreach ($users as $user) {
                $syncer->sync($user, $school);
                $count++;
            }

            $this->info("Synced {$count} users.");
        }

        return self::SUCCESS;
    }
}
