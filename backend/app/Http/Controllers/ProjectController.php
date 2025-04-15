<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with(['manager', 'creator'])->latest()->get();

        return response()->json([
            'projects' => $projects,
        ]);
    }

    public function show($id): JsonResponse
    {
        $project = Project::with(['manager', 'creator', 'team'])->findOrFail($id);

        return response()->json([
            'project' => $project
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'manager_id' => 'nullable|exists:employees,id',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        $project = Project::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'manager_id' => Auth::id(), // 👤 employé connecté
            'team_id' => $validated['team_id'] ?? null,
            'created_by' => Auth::id(), // 👤 employé connecté
        ]);

        return response()->json([
            'message' => 'Projet créé avec succès.',
            'project' => $project
        ], 201);
    }

    public function members($id): JsonResponse
    {
        $project = Project::with('members')->findOrFail($id);

        return response()->json([
            'members' => $project->members
        ]);
    }
}
