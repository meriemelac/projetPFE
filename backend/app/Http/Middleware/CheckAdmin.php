<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user || $user->role_id !== "1") {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        return $next($request);
    }
}
