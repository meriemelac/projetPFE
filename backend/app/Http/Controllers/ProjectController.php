<?php

namespace App\Http\Controllers;

use App\Project;
use Illuminate\Http\JsonResponse;

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

    public function members($id): JsonResponse
    {
        $project = Project::with('members')->findOrFail($id);

        return response()->json([
            'members' => $project->members
        ]);
    }
}
