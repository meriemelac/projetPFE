<?php

namespace App\Http\Controllers;

use App\Employee;
use App\Project;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{


    public function index()
    {
        /** @var \App\Employee $user */
        $user = Auth::user();

        switch ($user->role_id) {
            case 1: // Admin
                $employees = Employee::with('role', 'department', 'teams')->get();
                break;

            case 2: // Team Leader
                $employees = Employee::where('team_id', $user->team_id)->get();
                break;

            case 3: // Chef de Projet
                $projectIds = Project::where('manager_id', $user->id)->pluck('id');
                $employees = Employee::whereHas('tasks', function ($query) use ($projectIds) {
                    $query->whereIn('project_id', $projectIds);
                })->get();
                break;

            case 4: // Employé
                $userProjectIds = $user->tasks()->pluck('project_id')->unique();
                $employees = Employee::whereHas('tasks', function ($query) use ($userProjectIds) {
                    $query->whereIn('project_id', $userProjectIds);
                })->get();
                break;

            default:
                return response()->json(['message' => 'Rôle non reconnu'], 403);
        }

        return response()->json($employees);
    }
}
