<?php

namespace App\Http\Middleware;

use App\Models\School;
use App\Services\TenantManager;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenantConnection
{
    public function handle(Request $request, Closure $next): Response
    {
        $school = $this->resolveSchool($request);

        if ($school) {
            $path = $school->tenant_db_path;
            if (!$path) {
                if (config('tenancy.strict')) {
                    abort(500, 'Tenant database not configured. Run: php artisan school:provision ' . ($school->slug ?? $school->id));
                }

                return $next($request);
            }

            $dbPath = Str::startsWith($path, ['/','\\']) ? $path : database_path($path);
            if (!File::exists($dbPath)) {
                if (config('tenancy.strict')) {
                    abort(500, 'Tenant database missing. Run: php artisan school:provision ' . ($school->slug ?? $school->id));
                }

                return $next($request);
            }

            app(TenantManager::class)->resolveForSchool($school);
        }

        return $next($request);
    }

    private function resolveSchool(Request $request): ?School
    {
        $routeSchool = $request->route('school');

        if ($routeSchool instanceof School) {
            return $routeSchool;
        }

        if (is_string($routeSchool) || is_numeric($routeSchool)) {
            return School::query()
                ->where('slug', $routeSchool)
                ->orWhere('id', $routeSchool)
                ->first();
        }

        $user = $request->user();
        if ($user && $user->school_id) {
            return School::find($user->school_id);
        }

        return null;
    }
}
