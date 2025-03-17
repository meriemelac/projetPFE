<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('employees')->insert([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => bcrypt('password123'), // Assurez-vous d'utiliser bcrypt pour crypter le mot de passe
            'phone' => '0123456789',
            'position' => 'Director General', // Position : Directeur Général
            'role_id' => 1, // role_id = 1
            'profile_picture' => null, // Optionnel
            'status' => 'active', // Statut actif par défaut
            'hire_date' => Carbon::now(), // Date d'embauche actuelle
        ]);
    }
}
