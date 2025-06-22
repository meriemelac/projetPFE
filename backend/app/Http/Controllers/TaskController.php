<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use App\Employee;
use App\Project;
use App\Notification;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // Voir les tâches d’un projet
    public function index($projectId)
    {
        $user = Auth::user();
        $query = Task::with(['employees', 'comments', 'creator'])
            ->where('project_id', $projectId);

        if ($user->role_id == 1) {
            // admin → tout voir
        } elseif ($user->role_id == 2) {
            $query->whereHas('project.team.department', function ($q) use ($user) {
                $q->where('id', $user->department_id);
            });
        } elseif ($user->role_id == 3) {
            $query->whereHas('project.team', function ($q) use ($user) {
                $q->where('id', $user->team_id);
            });
        } else {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json($query->orderBy('status')->orderBy('position')->get());
    }

    public function show($id)
    {
        $task = Task::with(['project.team.department', 'creator', 'employees'])->findOrFail($id);
        $user = Auth::user();

        $canSee = $user->role_id == 1 ||
            ($user->role_id == 2 && $task->project->team->department_id == $user->department_id) ||
            ($user->role_id == 3 && $task->project->team_id == $user->team_id) ||
            $task->employees->contains('id', $user->id);

        if (!$canSee) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json(['task' => $task]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role_id, [1, 2, 3])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validated = $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'status' => 'in:todo,in_progress,in_test,done',
            'priority' => 'in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'project_id' => 'required|exists:projects,id',
        ]);

        $project = Project::with('team.department')->findOrFail($validated['project_id']);
        if ($user->role_id == 2 && $project->team->department_id != $user->department_id) {
            return response()->json(['message' => 'Projet hors de votre département'], 403);
        }
        if ($user->role_id == 3 && $project->team_id != $user->team_id) {
            return response()->json(['message' => 'Projet hors de votre équipe'], 403);
        }

        $validated['created_by'] = $user->id;
        $validated['position'] = Task::where('project_id', $validated['project_id'])
            ->where('status', $validated['status'])->count();

        $task = Task::create($validated);

        // 🔔 Notification
        // Notification::create([
        //     'content' => "Nouvelle tâche créée : {$task->title}",
        //     'employee_id' => $user->id,
        // ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::with('project.team.department')->findOrFail($id);
        $user = Auth::user();

        if (!($user->role_id == 1 ||
            ($user->role_id == 2 && $task->project->team->department_id == $user->department_id) ||
            ($user->role_id == 3 && $task->project->team_id == $user->team_id))) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $allowedFields = ['title', 'description', 'priority', 'due_date'];
        $data = $request->only($allowedFields);

        // 👀 Vérifier modification de status uniquement par employé assigné
        if ($request->has('status') && $request->status !== $task->status) {
            $userId = auth()->id();
            $isAssigned = $task->employees()->where('employee_id', $userId)->exists();

            if (!$isAssigned && !in_array($user->role_id, [1, 2, 3])) {
                return response()->json(['message' => 'Vous ne pouvez pas modifier le statut de cette tâche.'], 403);
            }
        }

        $task->update($data);

        // 🔔 Notification(ndiro chi boucle hnaya tewssel notif l kochi)
        Notification::create([
            'employee_id' => $user->id,
            'title' => 'Mise à jour de la tâche',
            'message' => 'La tâche "' . $task->title . '" a été mise à jour par ' . $user->first_name . ' ' . $user->last_name
        ]);

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::with('project.team.department')->findOrFail($id);
        $user = Auth::user();

        if (!($user->role_id == 1 ||
            ($user->role_id == 2 && $task->project->team->department_id == $user->department_id) ||
            ($user->role_id == 3 && $task->project->team_id == $user->team_id))) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $task->delete();

        Notification::create([
            'title' => "Une tâche a été supprimée.",
            'message' => "La tâche '{$task->title}' a été supprimée.",
            'employee_id' => $user->id,
        ]);

        return response()->json(['message' => 'Tâche supprimée']);
    }

    public function updateMyTaskStatus(Request $request, $id)
    {
        $userId = auth()->id();
        $task = Task::findOrFail($id);

        // vérifier si l'utilisateur est assigné à cette tâche
        $isAssigned = $task->employees()->where('employee_id', $userId)->exists();

        if (!$isAssigned) {
            return response()->json(['message' => 'Vous n\'êtes pas assigné à cette tâche.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,in_test,done',
            'position' => 'nullable|integer'
        ]);

        $task->status = $validated['status'];
        if (isset($validated['position'])) {
            $task->position = $validated['position'];
        }
        $task->save();

        return response()->json(['message' => 'Statut mis à jour avec succès.', 'task' => $task]);
    }


    public function assignEmployees(Request $request, $id)
    {
        $task = Task::with('project.team.department')->findOrFail($id);
        $user = Auth::user();

        if (!($user->role_id == 1 ||
            ($user->role_id == 2 && $task->project->team->department_id == $user->department_id) ||
            ($user->role_id == 3 && $task->project->team_id == $user->team_id))) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validated = $request->validate([
            'employees' => 'array',
            'employees.*' => 'exists:employees,id'
        ]);

        $task->employees()->sync($validated['employees']);

        Notification::create([
            'content' => "Des employés ont été assignés à la tâche '{$task->title}'.",
            'employee_id' => $user->id,
        ]);

        return response()->json(['message' => 'Employés assignés avec succès']);
    }

    public function updateStatus(Request $request, $id)
    {
        return $this->update($request, $id);
    }

    public function myTasksByProject($projectId)
    {
        $userId = auth()->id();
        $tasks = Task::with(['employees', 'creator', 'project'])
            ->where('project_id', $projectId)
            ->whereHas('employees', function ($q) use ($userId) {
                $q->where('employee_id', $userId);
            })
            ->orderBy('status')
            ->orderBy('position')
            ->get();

        return response()->json($tasks);
    }

    public function allTasksByProject($projectId)
    {
        $user = auth()->user();

        // Autoriser uniquement admin, chef de dep, chef d’équipe
        if (!in_array($user->role_id, [1, 2, 3])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $tasks = Task::with(['employees', 'comments', 'creator'])
            ->where('project_id', $projectId)
            ->orderBy('status')
            ->orderBy('position')
            ->get();

        return response()->json($tasks);
    }
}
