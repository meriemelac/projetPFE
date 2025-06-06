<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Project;
use App\Employee;
use App\Team;
use App\Task;
use Carbon\Carbon;

class DepartmentDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();

        // 1. Récupérer les projets créés par le chef de département ou ses chefs d'équipe
        $projects = Project::withCount([
            'tasks',
            'tasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'done');
            }
        ])->where(function ($query) use ($user) {
            $query->where('created_by', $user->id)
                ->orWhereHas('creator', function ($subQuery) use ($user) {
                    $subQuery->where('role_id', 3) // chef d'équipe
                        ->where('department_id', $user->department_id);
                });
        })->get();

        // 2. Statistiques globales du département
        $employeesCount = Employee::where('department_id', $user->department_id)->count();
        $teamsCount = Team::where('department_id', $user->department_id)->count();
        $projectsCount = $projects->count();
        $avgProgress = $projectsCount > 0
            ? round($projects->sum(function ($p) {
                return $p->tasks_count > 0
                    ? ($p->completed_tasks_count / $p->tasks_count) * 100
                    : 0;
            }) / $projectsCount)
            : 0;

        // 3. Liste des projets du département
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

        // 4. Tâches personnelles du chef de département
        $myTasks = Task::where('created_by', $user->id)
            ->with('project:id,title')
            ->get(['id', 'title', 'status', 'due_date', 'project_id']);

        // 5. Projets avec deadline proche (<= 5 jours)
        $today = Carbon::today();
        $threshold = $today->copy()->addDays(5);

        $upcomingDeadlines = $projects->filter(function ($p) use ($today, $threshold) {
            return $p->end_date >= $today && $p->end_date <= $threshold;
        })->sortBy('end_date')->map(function ($p) {
            $progress = $p->tasks_count > 0
                ? round(($p->completed_tasks_count / $p->tasks_count) * 100)
                : 0;

            return [
                'id' => $p->id,
                'title' => $p->title,
                'end_date' => $p->end_date,
                'status' => $p->status,
                'days_left' => Carbon::parse($p->end_date)->diffInDays(Carbon::today()),
                'progress' => $progress
            ];
        })->values();

        // 6. Répartition des tâches par équipe du département
        $teamTaskStats = Team::where('department_id', $user->department_id)
            ->with(['projects' => function ($query) {
                $query->withCount('tasks');
            }])
            ->get(['id', 'name'])
            ->map(function ($team) {
                $tasksCount = $team->projects->sum('tasks_count');
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'tasks_count' => $tasksCount
                ];
            });


        // 7. Réponse JSON complète
        return response()->json([
            'stats' => [
                'employees' => $employeesCount,
                'teams' => $teamsCount,
                'projects' => $projectsCount,
                'average_progress' => $avgProgress
            ],
            'projects' => $projectList,
            'my_tasks' => $myTasks,
            'upcoming_deadlines' => $upcomingDeadlines,
            'team_tasks_distribution' => $teamTaskStats
        ]);
    }
}
