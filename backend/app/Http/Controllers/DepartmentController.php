<?php

namespace App\Http\Controllers;

use App\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;


class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();

        if ($user->role_id == 1) {
            // Admin → voir tous les départements
            $departments = Department::all();
        } elseif ($user->role_id == 2) {
            // Chef de département → voir seulement son propre département
            $departments = Department::where('id', $user->department_id)->get();
        } else {
            // Les autres rôles ne peuvent rien voir
            return response()->json([
                'message' => 'Non autorisé à accéder aux départements.'
            ], 403);
        }

        return response()->json([
            'departments' => $departments
        ]);
    }

    public function getTeams($id)
    {
        $department = Department::with('teams')->findOrFail($id);

        return response()->json($department->teams);
    }
}
