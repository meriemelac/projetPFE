<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('projects')->insert([
            'title' => 'Développement Application Mobile',
            'description' => 'Application mobile pour gestion des tâches internes.',
            'status' => 'planned',
            'start_date' => Carbon::now()->toDateString(),
            'end_date' => Carbon::now()->addMonths(3)->toDateString(),
            'manager_id' => 1, // Assure-toi qu’un employé avec id=1 existe
            'created_by' => 1,
            'team_id' => null,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
