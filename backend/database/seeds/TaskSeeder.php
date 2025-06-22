<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $tasks = [
            // Projet 1 : Intranet Collaboratif 2025
            [
                'title' => 'Créer l’authentification des utilisateurs',
                'description' => 'Développer le système de login/logout sécurisé.',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => $now->copy()->addDays(7),
                'project_id' => 1,
                'assigned_to' => 5,
            ],
            [
                'title' => 'Créer le tableau Kanban',
                'description' => 'Développer l’interface drag-and-drop pour la gestion des tâches.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => $now->copy()->addDays(10),
                'project_id' => 1,
                'assigned_to' => 10,
            ],

            // Projet 2 : Application Mobile RH
            [
                'title' => 'Configurer l’API d’authentification mobile',
                'description' => 'Développer une API REST sécurisée pour l’app mobile.',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => $now->copy()->addDays(14),
                'project_id' => 2,
                'assigned_to' => 9,
            ],
            [
                'title' => 'Créer l’interface mobile RH',
                'description' => 'Développement de la page d’accueil mobile pour RH.',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => $now->copy()->addDays(18),
                'project_id' => 2,
                'assigned_to' => 10,
            ],

            // Projet 3 : Refonte du portail Web
            [
                'title' => 'Maquetter la nouvelle version du portail',
                'description' => 'Créer les wireframes avec Figma pour la nouvelle architecture.',
                'status' => 'in_progress',
                'priority' => 'low',
                'due_date' => $now->copy()->addDays(8),
                'project_id' => 3,
                'assigned_to' => 9,
            ],
            [
                'title' => 'Intégrer la page d’accueil',
                'description' => 'Coder la nouvelle page d’accueil responsive.',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => $now->copy()->addDays(12),
                'project_id' => 3,
                'assigned_to' => 8,
            ],

            // Projet 4 : Interface Dashboard Employés
            [
                'title' => 'Développer le tableau de bord des employés',
                'description' => 'Afficher les KPIs et infos utiles dans le dashboard.',
                'status' => 'done',
                'priority' => 'medium',
                'due_date' => $now->copy()->subDays(10),
                'project_id' => 4,
                'assigned_to' => 8,
            ],
            [
                'title' => 'Mettre en place les statistiques dynamiques',
                'description' => 'Connexion avec la base de données et calcul en temps réel.',
                'status' => 'done',
                'priority' => 'high',
                'due_date' => $now->copy()->subDays(8),
                'project_id' => 4,
                'assigned_to' => 10,
            ],
        ];

        foreach ($tasks as $task) {
            $taskId = DB::table('tasks')->insertGetId([
                'title' => $task['title'],
                'description' => $task['description'],
                'status' => $task['status'],
                'priority' => $task['priority'],
                'due_date' => $task['due_date'],
                'project_id' => $task['project_id'],
                'created_by' => 5, // Team leader backend
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('employee_task')->insert([
                'employee_id' => $task['assigned_to'],
                'task_id' => $taskId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
