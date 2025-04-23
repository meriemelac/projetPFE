<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAssignableRole
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $targetRoleId = $request->role_id;

        // Si pas de rôle envoyé, on laisse passer (par exemple dans une requête GET)
        if (!$targetRoleId) {
            return $next($request);
        }

        // Si le chef de département essaie d'affecter un rôle non autorisé
        if ($user->role_id == 2 && !in_array($targetRoleId, [3, 4])) {
            return response()->json([
                'message' => 'Non autorisé à affecter ce rôle.'
            ], 403);
        }

        // Sinon, tout est OK
        return $next($request);
    }
}
