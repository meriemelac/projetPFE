<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Employee;
use App\Project;
use App\Team;
use App\Task;
use Carbon\Carbon;

class TeamDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();

        // 1. Membres de l'équipe
        $membersCount = Employee::where('team_id', $user->team_id)->count();

        // 2. Projets créés par le chef d'équipe
        $projects = Project::withCount([
            'tasks',
            'tasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'done');
            }
        ])->where('created_by', $user->id)->get();

        $projectsCount = $projects->count();
        $avgProgress = $projectsCount > 0
            ? round($projects->sum(function ($p) {
                return $p->tasks_count > 0
                    ? ($p->completed_tasks_count / $p->tasks_count) * 100
                    : 0;
            }) / $projectsCount)
            : 0;

        // 3. Toutes les tâches de l'équipe (via les projets de l'équipe)
        $teamTasks = Task::whereHas('project', function ($q) use ($user) {
            $q->where('team_id', $user->team_id);
        })->with('project:id,title')->get(['id', 'title', 'status', 'due_date', 'project_id', 'created_by']);

        $teamTasksCount = $teamTasks->count();

        // 4. Tâches personnelles du chef d'équipe
        $myTasks = Task::where('created_by', $user->id)
            ->with('project:id,title')
            ->get(['id', 'title', 'status', 'due_date', 'project_id']);

        // 5. Liste des projets créés avec progress
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

        // 6. Répartition des tâches par membre de l’équipe (via created_by)
        $taskByMember = Employee::where('team_id', $user->team_id)
            ->withCount(['tasks as tasks_count' => function ($q) use ($user) {
                $q->whereHas('project', function ($q2) use ($user) {
                    $q2->where('team_id', $user->team_id);
                });
            }])->get(['id', 'first_name', 'last_name']);

        // 7. Réponse JSON
        return response()->json([
            'stats' => [
                'members' => $membersCount,
                'projects' => $projectsCount,
                'team_tasks' => $teamTasksCount,
                'average_progress' => $avgProgress
            ],
            'projects' => $projectList,
            'my_tasks' => $myTasks,
            'team_tasks' => $teamTasks,
            'task_distribution' => $taskByMember
        ]);
    }
}
