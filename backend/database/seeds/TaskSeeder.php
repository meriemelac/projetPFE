<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    public function run()
    {
        // Crée une tâche
        $taskId = DB::table('tasks')->insertGetId([
            'title' => 'Créer l’authentification des utilisateurs',
            'description' => 'Développer le système de login/logout sécurisé.',
            'status' => 'todo',
            'priority' => 'high',
            'due_date' => Carbon::now()->addWeek()->toDateString(),
            'project_id' => 1, // Assure-toi qu’un projet avec ID 1 existe
            'created_by' => 1, // Assure-toi qu’un employé avec ID 1 existe
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Assigner la tâche à plusieurs employés (ID 1 et 2 par exemple)
        DB::table('employee_task')->insert([
            [
                'employee_id' => 1,
                'task_id' => $taskId,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // [
            //     'employee_id' => 2,
            //     'task_id' => $taskId,
            //     'created_at' => Carbon::now(),
            //     'updated_at' => Carbon::now(),
            // ]
        ]);
    }
}
