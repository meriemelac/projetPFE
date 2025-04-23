<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->truncate(); // pour éviter les doublons si rerun

        DB::table('roles')->insert([
            [
                'name' => 'admin',
                'description' => 'Directeur Général / Secrétaire Générale',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'department_leader',
                'description' => 'Chef de département',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'team_leader',
                'description' => 'Responsable d’équipe',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'employee',
                'description' => 'Membre employé',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
