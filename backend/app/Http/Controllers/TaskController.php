<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = Task::with(['project', 'creator', 'employees'])->latest()->get();

        return response()->json([
            'tasks' => $tasks
        ]);
    }

    public function show($id)
    {
        $task = Task::with(['project', 'creator', 'employees'])->findOrFail($id);

        return response()->json([
            'task' => $task
        ]);
    }
}
