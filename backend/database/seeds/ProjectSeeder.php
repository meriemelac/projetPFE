<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('projects')->insert([
            'title' => 'Intranet Collaboratif 2025',
            'description' => 'Développement d’une plateforme interne pour centraliser la gestion RH, IT et Communication.',
            'status' => 'in_progress',
            'start_date' => now()->subDays(15),
            'end_date' => now()->addMonths(2),
            'manager_id' => 8, // 👈 Meriem (peut être n’importe quel employé)
            'created_by' => 1, // Admin (John)
            'team_id' => null, // facultatif si le projet est multi-équipes
            'created_at' => now(),
            'updated_at' => now(),
        ]);        
    }
}
