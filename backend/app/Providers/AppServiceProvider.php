<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\School;
use App\Observers\SchoolObserver;
use App\Console\Commands\ProvisionSchoolDatabase;
use App\Console\Commands\ProvisionAllSchoolDatabases;
use App\Console\Commands\SyncSchoolConfigs;
use App\Console\Commands\MigrateSchoolData;
use App\Console\Commands\MigrateAllSchoolData;
use App\Console\Commands\AuditTenantData;
use App\Console\Commands\AuditAllTenantData;
use App\Console\Commands\CleanupApplicantTempFiles;
use App\Console\Commands\DedupeApplicantApplications;
use App\Console\Commands\PurgeApplicantApplications;
use App\Console\Commands\PurgeApplicationDocuments;
use App\Console\Commands\PurgeStudentApplications;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Services\TenantManager::class, function () {
            return new \App\Services\TenantManager();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register observers
        School::observe(SchoolObserver::class);

        if ($this->app->runningInConsole()) {
            $this->commands([
                ProvisionSchoolDatabase::class,
                ProvisionAllSchoolDatabases::class,
                SyncSchoolConfigs::class,
                MigrateSchoolData::class,
                MigrateAllSchoolData::class,
                AuditTenantData::class,
                AuditAllTenantData::class,
                CleanupApplicantTempFiles::class,
                DedupeApplicantApplications::class,
                PurgeApplicantApplications::class,
                PurgeApplicationDocuments::class,
                PurgeStudentApplications::class,
            ]);
        }
    }
}
