<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Employee;
use App\Project;
use App\Task;
use Carbon\Carbon;

class EmployeeDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        /** @var Employee $user */
        $user = auth()->user(); // doit être une instance de App\Employee

        // 1. Projets auxquels il participe (via project_members)
        $projects = $user->projects()->withCount([
            'tasks',
            'tasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'done');
            }
        ])->get();

        $projectsCount = $projects->count();

        // 2. Moyenne d’avancement de ces projets
        $avgProgress = $projectsCount > 0
            ? round($projects->sum(function ($p) {
                return $p->tasks_count > 0
                    ? ($p->completed_tasks_count / $p->tasks_count) * 100
                    : 0;
            }) / $projectsCount)
            : 0;

        // 3. Tâches assignées à l’employé (via employee_task)
        $myTasks = $user->tasks()->with('project:id,title')->get();

        $tasksCount = $myTasks->count();
        $completedTasksCount = $myTasks->where('status', 'done')->count();

        // 4. Projets avec taux de progression individuel
        $projectList = $projects->map(function ($p) {
            $progress = $p->tasks_count > 0
                ? round(($p->completed_tasks_count / $p->tasks_count) * 100)
                : 0;

            return [
                'id' => $p->id,
                'title' => $p->title,
                'status' => $p->status,
                'start_date' => $p->start_date,
                'end_date' => $p->end_date,
                'progress' => $progress
            ];
        });

        // 5. Réponse JSON
        return response()->json([
            'stats' => [
                'projects' => $projectsCount,
                'tasks' => $tasksCount,
                'completed_tasks' => $completedTasksCount,
                'average_progress' => $avgProgress
            ],
            'projects' => $projectList,
            'my_tasks' => $myTasks
        ]);
    }
}
