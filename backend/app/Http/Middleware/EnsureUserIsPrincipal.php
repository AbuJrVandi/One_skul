<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsPrincipal
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->role === 'admin' && auth()->user()->school_id !== null) {
            return $next($request);
        }

        abort(403, 'Unauthorized. This area is for School Principals only.');
    }
}
