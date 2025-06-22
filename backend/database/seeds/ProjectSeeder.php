<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('projects')->insert([
            [
                'title' => 'Intranet Collaboratif 2025',
                'description' => 'Développement d’une plateforme interne pour centraliser la gestion RH, IT et Communication.',
                'status' => 'En cours',
                'start_date' => now()->subDays(15),
                'end_date' => now()->addDays(2),
                'manager_id' => 5, // Rachid El Idrissi (Team Leader Backend)
                'created_by' => 5,
                'team_id' => 1, // Équipe Backend 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Application Mobile RH',
                'description' => 'Création d’une application mobile pour les services RH internes.',
                'status' => 'En cours',
                'start_date' => now()->addDays(5),
                'end_date' => now()->addMonths(1)->addDays(10),
                'manager_id' => 5, // Rachid El Idrissi
                'created_by' => 5,
                'team_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Refonte du portail Web',
                'description' => 'Refonte complète du portail web de l’entreprise avec une architecture moderne.',
                'status' => 'En cours',
                'start_date' => now()->subDays(10),
                'end_date' => now()->addMonths(1),
                'manager_id' => 5, // Rachid El Idrissi
                'created_by' => 5,
                'team_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Interface Dashboard Employés',
                'description' => 'Développement d’un tableau de bord interactif pour les employés.',
                'status' => 'Terminé',
                'start_date' => now()->subMonths(2),
                'end_date' => now()->subDays(10),
                'manager_id' => 5,
                'created_by' => 5,
                'team_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
