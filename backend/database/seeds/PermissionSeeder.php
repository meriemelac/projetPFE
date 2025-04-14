<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Utilisateurs
            ['name' => 'view_employees', 'description' => 'Voir les employés'],
            ['name' => 'create_employee', 'description' => 'Créer un employé'],
            ['name' => 'edit_employee', 'description' => 'Modifier un employé'],
            ['name' => 'delete_employee', 'description' => 'Supprimer un employé'],

            // Rôles
            ['name' => 'view_roles', 'description' => 'Voir les rôles'],
            ['name' => 'assign_role', 'description' => 'Assigner un rôle à un utilisateur'],

            // Départements & équipes
            ['name' => 'view_departments', 'description' => 'Voir les départements'],
            ['name' => 'create_department', 'description' => 'Créer un département'],
            ['name' => 'view_teams', 'description' => 'Voir les équipes'],
            ['name' => 'create_team', 'description' => 'Créer une équipe'],
            ['name' => 'assign_employees_to_team', 'description' => 'Assigner des employés à une équipe'],

            // Projets
            ['name' => 'view_projects', 'description' => 'Voir les projets'],
            ['name' => 'create_project', 'description' => 'Créer un projet'],
            ['name' => 'edit_project', 'description' => 'Modifier un projet'],
            ['name' => 'delete_project', 'description' => 'Supprimer un projet'],
            ['name' => 'assign_team_to_project', 'description' => 'Assigner une équipe à un projet'],
            ['name' => 'add_members_to_project', 'description' => 'Ajouter des membres à un projet'],

            // Tâches
            ['name' => 'view_tasks', 'description' => 'Voir les tâches'],
            ['name' => 'create_task', 'description' => 'Créer une tâche'],
            ['name' => 'edit_task', 'description' => 'Modifier une tâche'],
            ['name' => 'delete_task', 'description' => 'Supprimer une tâche'],
            ['name' => 'assign_task', 'description' => 'Assigner une tâche à un ou plusieurs employés'],
            ['name' => 'change_task_status', 'description' => 'Changer le statut d\'une tâche'],

            // Commentaires
            ['name' => 'view_comments', 'description' => 'Voir les commentaires'],
            ['name' => 'add_comment', 'description' => 'Ajouter un commentaire'],
            ['name' => 'delete_comment', 'description' => 'Supprimer un commentaire'],

            // Dashboard & logs
            ['name' => 'view_dashboard', 'description' => 'Accéder au tableau de bord'],
            ['name' => 'view_activity_logs', 'description' => 'Voir l’historique des activités'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->insert([
                'name' => $permission['name'],
                'description' => $permission['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
