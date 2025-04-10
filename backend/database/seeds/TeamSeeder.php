<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TeamSeeder extends Seeder
{
    public function run()
    {
        DB::table('teams')->insert([
            [
                'name' => 'Équipe Backend',
                'description' => 'Responsable des API et de la logique métier.',
                'department_id' => 1, // Assure-toi que le département avec ID 1 existe
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Équipe Frontend',
                'description' => 'Responsable de l’interface utilisateur.',
                'department_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
