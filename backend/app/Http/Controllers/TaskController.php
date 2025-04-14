<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Task;
use App\Employee;

class TaskController extends Controller
{
    // 🔍 Toutes les tâches d’un projet
    public function index($projectId)
    {
        $tasks = Task::with(['employees', 'comments', 'creator'])
            ->where('project_id', $projectId)
            ->orderBy('status')
            ->orderBy('position')
            ->get();

        return response()->json($tasks);
    }

    public function show($id)
    {
        $task = Task::with(['project', 'creator', 'employees'])->findOrFail($id);

        return response()->json([
            'task' => $task
        ]);
    }

    // ➕ Créer une tâche
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'status' => 'in:todo,in_progress,in_test,done',
            'priority' => 'in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'project_id' => 'required|exists:projects,id',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['position'] = Task::where('project_id', $validated['project_id'])
            ->where('status', $validated['status'])->count();

        $task = Task::create($validated);
        return response()->json($task, 201);
    }

    // ✏️ Modifier une tâche
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update($request->only([
            'title',
            'description',
            'status',
            'priority',
            'due_date'
        ]));

        return response()->json($task);
    }

    // 🔁 Changer le statut & position après drag
    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update([
            'status' => $request->status,
            'position' => $request->position
        ]);
        return response()->json($task);
    }

    // 👥 Assigner plusieurs employés
    public function assignEmployees(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'employees' => 'array',
            'employees.*' => 'exists:employees,id'
        ]);

        $task->employees()->sync($validated['employees']);
        return response()->json(['message' => 'Employés assignés avec succès']);
    }

    // 🗑 Supprimer une tâche
    public function destroy($id)
    {
        Task::destroy($id);
        return response()->json(['message' => 'Tâche supprimée']);
    }

    public function myTasksByProject($projectId)
    {
        $userId = auth()->id();

        $tasks = Task::with(['employees', 'creator', 'project'])
            ->where('project_id', $projectId)
            ->whereHas('employees', function ($query) use ($userId) {
                $query->where('employee_id', $userId);
            })
            ->orderBy('status')
            ->orderBy('position')
            ->get();

        return response()->json($tasks);
    }
}
