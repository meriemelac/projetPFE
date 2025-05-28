<?php

namespace App\Http\Controllers;

use App\Employee;
use App\Project;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{

    public function index()
    {
        /** @var \App\Employee $user */
        $user = Auth::user();

        switch ($user->role_id) {
            case 1: // Admin
                $employees = Employee::with('role', 'department', 'team')->get();
                break;

            case 2: // Department Leader
                $employees = Employee::where('department_id', $user->department_id)->get();
                break;

            case 3: // Team Leader
                $employees = Employee::where('team_id', $user->team_id)
                    ->with('role', 'department', 'team')
                    ->get();
                break;


            // case 4: // Chef de Projet
            //     $projectIds = Project::where('manager_id', $user->id)->pluck('id');
            //     $employees = Employee::whereHas('tasks', function ($query) use ($projectIds) {
            //         $query->whereIn('project_id', $projectIds);
            //     })->get();
            //     break;

            case 4: // Employé
                $employees = Employee::where('team_id', $user->team_id)
                    ->with('role', 'department', 'team')
                    ->get();
                break;

            default:
                return response()->json(['message' => 'Rôle non reconnu'], 403);
        }

        return response()->json($employees);
    }


    public function store(Request $request)
    {
        $user = Auth::user();

        // 1. Vérification de droit : département
        if ($user->role_id == 2 && $request->department_id != $user->department_id) {
            return response()->json(['message' => 'Non autorisé à créer un employé dans un autre département.'], 403);
        }

        // 2. Vérification de l’équipe sélectionnée
        if ($request->filled('team_id')) {
            $team = \App\Team::find($request->team_id);

            if (!$team) {
                return response()->json(['message' => 'Équipe introuvable.'], 404);
            }

            if ($user->role_id == 2 && $team->department_id != $user->department_id) {
                return response()->json(['message' => 'Cette équipe ne vous appartient pas.'], 403);
            }

            if ($team->department_id != $request->department_id) {
                return response()->json(['message' => 'L\'équipe sélectionnée ne correspond pas au département.'], 400);
            }
        }

        // 3. Validation
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'email'          => 'required|email|unique:employees,email',
            'password'       => 'required|string|min:6',
            'phone'          => 'nullable|string|max:20',
            'position'       => 'required|string|max:255',
            'role_id'        => 'required|exists:roles,id',
            'department_id'  => 'required|exists:departments,id',
            'team_id'        => 'nullable|exists:teams,id',
            'profile_picture' => 'nullable|image|max:2048', // Valide une image si présente
        ]);

        // 4. Gestion du fichier image (si présent)
        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $request->file('profile_picture')->store('profile_photos', 's3');
        }

        // 5. Création de l'employé
        $employee = \App\Employee::create([
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'email'          => $validated['email'],
            'password'       => Hash::make($validated['password']),
            'phone'          => $validated['phone'] ?? null,
            'position'       => $validated['position'],
            'role_id'        => $validated['role_id'],
            'department_id'  => $validated['department_id'],
            'team_id'        => $validated['team_id'] ?? null,
            'profile_picture' => $profilePicturePath,
            'status'         => 'active',
            'hire_date'      => now(),
        ]);

        return response()->json($employee, 201);
    }

    public function show($id)
    {
        $employee = Employee::with('department', 'team', 'role')->findOrFail($id);

        return response()->json($employee);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:20',
            'position' => 'required|string|max:255',
            'role_id' => 'required|exists:roles,id',
            'department_id' => 'required|exists:departments,id',
            'team_id' => 'nullable|exists:teams,id',
            'status' => 'required|in:active,inactive',
        ]);

        $employee->update($validated);

        return response()->json([
            'message' => 'Employé mis à jour avec succès.',
            'employee' => $employee
        ]);
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        $employee->delete();

        return response()->json([
            'message' => 'Employé supprimé avec succès.'
        ]);
    }
}
