<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Project;
use App\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(): JsonResponse
{
    $user = Auth::user();

    switch ($user->role_id) {
        case 1: // Admin (voit tout)
            $projects = Project::with(['manager', 'creator'])->latest()->get();
            break;

        case 2: // Chef de département : projets qui impliquent une team de son département
            $projects = Project::whereHas('members.team', function ($query) use ($user) {
                $query->where('department_id', $user->department_id);
            })->with(['manager', 'creator'])->latest()->get();
            break;

        case 3: // Chef d’équipe : projets qui impliquent un membre de son équipe
            $projects = Project::whereHas('members', function ($query) use ($user) {
                $query->where('team_id', $user->team_id);
            })->with(['manager', 'creator'])->latest()->get();
            break;

        case 4: // Employé : projets où il est lui-même membre
            $projects = Project::whereHas('members', function ($query) use ($user) {
                $query->where('employee_id', $user->id);
            })->with(['manager', 'creator'])->latest()->get();
            break;

        default:
            $projects = collect(); // vide si rôle inconnu
    }

    return response()->json(['projects' => $projects]);
}




    public function show($id): JsonResponse
    {
        $project = Project::with(['manager', 'creator', 'team'])->findOrFail($id);

        return response()->json(['project' => $project]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->role_id, [1, 2, 3])) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'manager_id' => 'required|exists:employees,id',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        $project = Project::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'manager_id' => $validated['manager_id'],
            'team_id' => $validated['team_id'] ?? null,
            'created_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'Projet créé avec succès.',
            'project' => $project
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        $project = Project::findOrFail($id);

        if (!in_array($user->role_id, [1, 2, 3])) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'manager_id' => 'required|exists:employees,id',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        $project->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'manager_id' => $validated['manager_id'],
            'team_id' => $validated['team_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Projet mis à jour avec succès.',
            'project' => $project
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $project = Project::findOrFail($id);

        if (!in_array($user->role_id, [1, 2, 3])) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Projet supprimé avec succès.']);
    }

    public function members($id): JsonResponse
    {
        $project = Project::with('members')->findOrFail($id);

        return response()->json(['members' => $project->members]);
    }

    public function availableManagers(): JsonResponse
    {
        $user = Auth::user();

        switch ($user->role_id) {
            case 1: // Admin
                $employees = Employee::select('id', 'first_name', 'last_name')->get();
                break;

            case 2: // Chef de département
                $employees = Employee::where('department_id', $user->department_id)->get();
                break;

            case 3: // Chef d’équipe
                $employees = Employee::whereHas('teams', function ($query) use ($user) {
                    $query->whereIn('teams.id', $user->teams->pluck('id'));
                })->get();
                break;

            default:
                $employees = collect();
        }

        return response()->json(['employees' => $employees]);
    }
}
