<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Project;
use App\Employee;
use App\Department;
use App\Team;
use Carbon\Carbon;

class DgDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // 1. Statistiques générales
        $employeesCount = Employee::count();
        $departmentsCount = Department::count();
        $teamsCount = Team::count();
        $projectsCount = Project::count();

        // 2. Charger tous les projets avec counts des membres et des tâches
        $projects = Project::withCount([
            'tasks',
            'tasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'done');
            },
            'members'
        ])->get();

        // 3. Top 5 projets avec le plus de membres (avec progress)
        $topProjects = $projects
            ->sortByDesc('members_count')
            ->take(5)
            ->map(function ($project) {
                $progress = $project->tasks_count > 0
                    ? round(($project->completed_tasks_count / $project->tasks_count) * 100)
                    : 0;

                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'status' => $project->status,
                    'start_date' => $project->start_date,
                    'end_date' => $project->end_date,
                    'members_count' => $project->members_count,
                    'progress' => $progress
                ];
            });

        // 4. Projets avec une date limite proche (<= 5 jours)
        $today = Carbon::today();
        $threshold = Carbon::today()->addDays(5);

        $upcomingProjects = $projects->filter(function ($project) use ($today, $threshold) {
            return $project->end_date >= $today && $project->end_date <= $threshold;
        })->sortBy('end_date')->map(function ($project) {
            $progress = $project->tasks_count > 0
                ? round(($project->completed_tasks_count / $project->tasks_count) * 100)
                : 0;

            return [
                'id' => $project->id,
                'title' => $project->title,
                'end_date' => $project->end_date,
                'days_left' => Carbon::parse($project->end_date)->diffInDays(Carbon::today()),
                'status' => $project->status,
                'progress' => $progress
            ];
        })->values();

        // 5. Liste de tous les projets avec leur progression
        $projectProgressList = $projects->map(function ($project) {
            $progress = $project->tasks_count > 0
                ? round(($project->completed_tasks_count / $project->tasks_count) * 100)
                : 0;

            return [
                'id' => $project->id,
                'title' => $project->title,
                'status' => $project->status,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'progress' => $progress
            ];
        });

        // 6. Évolution mensuelle des projets créés / terminés
        $createdByMonth = Project::selectRaw("DATE_TRUNC('month', created_at) as month, COUNT(*) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $completedByMonth = Project::where('status', 'Terminé')
            ->selectRaw("DATE_TRUNC('month', updated_at) as month, COUNT(*) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 7. Réponse JSON
        return response()->json([
            'stats' => [
                'employees' => $employeesCount,
                'departments' => $departmentsCount,
                'teams' => $teamsCount,
                'projects' => $projectsCount,
            ],
            'top_projects' => $topProjects,
            'upcoming_deadlines' => $upcomingProjects,
            'project_progress_list' => $projectProgressList,
            'project_evolution' => [
                'created' => $createdByMonth,
                'completed' => $completedByMonth,
            ],
        ]);
    }
}
