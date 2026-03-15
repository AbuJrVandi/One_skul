<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantManager
{
    private ?School $school = null;

    public function resolveForSchool(School $school): void
    {
        $path = $school->tenant_db_path;

        if (!$path) {
            return;
        }

        if (!Str::startsWith($path, ['/','\\'])) {
            $path = database_path($path);
        }

        config([
            'database.connections.tenant' => [
                'driver' => 'sqlite',
                'database' => $path,
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);

        DB::purge('tenant');
        DB::reconnect('tenant');

        $this->school = $school;
    }

    public function isResolved(): bool
    {
        return $this->school !== null;
    }

    public function school(): ?School
    {
        return $this->school;
    }
}
