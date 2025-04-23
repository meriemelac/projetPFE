<?php

namespace App\Http\Controllers;

use App\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepartmentController extends Controller
{
    // Tous les utilisateurs peuvent voir leur propre département
    public function index(): JsonResponse
    {
        $user = Auth::user();

        if ($user->role_id == 1) {
            // Admin → tous les départements
            $departments = Department::all();
        } else {
            // Employé → uniquement son propre département
            $departments = Department::where('id', $user->department_id)->get();
        }

        return response()->json(['departments' => $departments]);
    }

    // ✳️ Méthodes protégées par le middleware "is_admin"

    public function show($id): JsonResponse
    {
        $department = Department::findOrFail($id);
        return response()->json(['department' => $department]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $department = Department::create($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Département créé avec succès.',
            'department' => $department
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $department = Department::findOrFail($id);
        $department->update($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Département mis à jour avec succès.',
            'department' => $department
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json(['message' => 'Département supprimé avec succès.']);
    }

    // Méthode utile pour afficher les équipes d’un département
    public function getTeams($id)
    {
        $department = \App\Department::with('teams')->findOrFail($id);
        return response()->json($department->teams);
    }
}
