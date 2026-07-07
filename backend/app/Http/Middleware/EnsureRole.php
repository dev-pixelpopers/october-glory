<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /** Usage: ->middleware('role:admin') or 'role:admin,worker'. */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Role-gated areas additionally require a full (password-verified)
        // session — a scoped guest-session token must never reach them even
        // if the matching email belongs to an admin or worker.
        if (! $user || ! $user->is_active || ! in_array($user->role, $roles, true) || ! $user->hasFullSession()) {
            abort(403, 'You do not have permission to perform this action.');
        }

        return $next($request);
    }
}
