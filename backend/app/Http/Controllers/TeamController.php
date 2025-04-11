<?php

namespace App\Http\Controllers;

use App\Team;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        $teams = Team::with('department')->get();

        return response()->json([
            'teams' => $teams,
        ]);
    }

    public function show($id)
    {
        $team = Team::with('employees')->findOrFail($id);

        return response()->json($team);
    }
}
