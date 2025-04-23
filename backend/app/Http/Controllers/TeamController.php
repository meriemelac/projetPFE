<?php

namespace App\Http\Controllers;

use App\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();

        switch ($user->role_id) {
            case 1: // Admin
                $teams = Team::with('department')->get();
                break;

            case 2: // Chef de département
                $teams = Team::with('department')
                    ->where('department_id', $user->department_id)
                    ->get();
                break;

            default: // Employé, Chef de projet, etc.
                $teams = $user->teams()->with('department')->get();
                break;
        }

        return response()->json(['teams' => $teams]);
    }

    public function show($id): JsonResponse
    {
        $team = Team::with('employees', 'department')->findOrFail($id);

        $user = Auth::user();

        // Accès autorisé si : admin OU chef de département du même département OU membre de l’équipe
        if (
            $user->role_id === "1" ||
            ($user->role_id === "2" && $user->department_id === $team->department_id) ||
            $team->employees->contains('id', $user->id)
        ) {
            return response()->json($team);
        }

        return response()->json(['message' => 'Accès non autorisé.'], 403);
    }

    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!($user->role_id === "1" || $user->role_id === "2")) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
        ]);

        // Les chefs de département ne peuvent créer que dans leur propre département
        if ($user->role_id === "2" && $user->department_id !== $request->department_id) {
            return response()->json(['message' => 'Vous ne pouvez créer que dans votre département.'], 403);
        }

        $team = Team::create($request->only(['name', 'description', 'department_id']));

        return response()->json(['message' => 'Équipe créée avec succès.', 'team' => $team], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        $team = Team::findOrFail($id);

        if (
            !($user->role_id === "1" || ($user->role_id === "2" && $team->department_id === $user->department_id))
        ) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team->update($request->only(['name', 'description']));

        return response()->json(['message' => 'Équipe mise à jour avec succès.', 'team' => $team]);
    }

    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $team = Team::findOrFail($id);

        if (
            !($user->role_id === "1" || ($user->role_id === "2" && $team->department_id === $user->department_id))
        ) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $team->delete();

        return response()->json(['message' => 'Équipe supprimée avec succès.']);
    }
}
