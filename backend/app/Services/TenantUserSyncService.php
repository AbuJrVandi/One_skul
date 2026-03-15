<?php

namespace App\Services;

use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class TenantUserSyncService
{
    public function sync(User $user, ?School $school = null): void
    {
        $school = $school ?? ($user->school_id ? School::find($user->school_id) : null);
        if (!$school) {
            return;
        }

        $dbPath = $school->tenant_db_path
            ? (str_starts_with($school->tenant_db_path, '/') ? $school->tenant_db_path : database_path($school->tenant_db_path))
            : null;

        if (!$dbPath || !File::exists($dbPath)) {
            throw new \RuntimeException('School database not provisioned. Run: php artisan school:provision ' . ($school->slug ?? $school->id));
        }

        $tenant = app(TenantManager::class);
        if (!$tenant->isResolved() || !$tenant->school() || $tenant->school()->id !== $school->id) {
            $tenant->resolveForSchool($school);
        }

        $exists = DB::connection('tenant')->table('users')->where('id', $user->id)->exists();

        $payload = [
            'school_id' => $user->school_id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'password' => $user->password,
            'role' => $user->role,
            'remember_token' => $user->remember_token,
            'is_active' => $user->is_active ?? true,
            'updated_at' => now(),
        ];

        if ($exists) {
            DB::connection('tenant')->table('users')->where('id', $user->id)->update($payload);
            return;
        }

        $payload['id'] = $user->id;
        $payload['created_at'] = $user->created_at ?? now();
        DB::connection('tenant')->table('users')->insert($payload);
    }

    public function delete(User $user, ?School $school = null): void
    {
        $school = $school ?? ($user->school_id ? School::find($user->school_id) : null);
        if (!$school) {
            return;
        }

        $dbPath = $school->tenant_db_path
            ? (str_starts_with($school->tenant_db_path, '/') ? $school->tenant_db_path : database_path($school->tenant_db_path))
            : null;

        if (!$dbPath || !File::exists($dbPath)) {
            return;
        }

        $tenant = app(TenantManager::class);
        if (!$tenant->isResolved() || !$tenant->school() || $tenant->school()->id !== $school->id) {
            $tenant->resolveForSchool($school);
        }

        DB::connection('tenant')->table('users')->where('id', $user->id)->delete();
    }
}
