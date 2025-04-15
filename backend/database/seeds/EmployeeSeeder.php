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
    DB::table('employees')->insert([
        [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => bcrypt('password123'),
            'phone' => '0123456789',
            'position' => 'Directeur Général',
            'role_id' => 1, // admin
            'department_id' => null,
            'profile_picture' => null,
            'status' => 'active',
            'hire_date' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'first_name' => 'Sara',
            'last_name' => 'El Idrissi',
            'email' => 'sara.teamlead@example.com',
            'password' => bcrypt('password123'),
            'phone' => '0611223344',
            'position' => 'Team Leader',
            'role_id' => 2, // team_leader
            'department_id' => 1,
            'profile_picture' => null,
            'status' => 'active',
            'hire_date' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'first_name' => 'Youssef',
            'last_name' => 'Bennani',
            'email' => 'youssef.pm@example.com',
            'password' => bcrypt('password123'),
            'phone' => '0606060606',
            'position' => 'Chef de Projet',
            'role_id' => 3, // project_leader
            'department_id' => 2,
            'profile_picture' => null,
            'status' => 'active',
            'hire_date' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'first_name' => 'Meriem',
            'last_name' => 'Achkar',
            'email' => 'meriem.achkar@example.com',
            'password' => bcrypt('password123'),
            'phone' => '0123456789',
            'position' => 'Développeur',
            'role_id' => 4, // employé
            'department_id' => null,
            'profile_picture' => null,
            'status' => 'active',
            'hire_date' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
    ]);
}

}
