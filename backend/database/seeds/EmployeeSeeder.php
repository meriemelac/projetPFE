<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('employees')->insert([
            // DG
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'password' => bcrypt('password123'),
                'phone' => '0600000000',
                'position' => 'Directeur Général',
                'role_id' => 1,
                'department_id' => null,
                'team_id' => null,
                'profile_picture' => null,
                'status' => 'active',
                'hire_date' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Responsables de départements (Department Leaders)
            [
                'first_name' => 'Sarah',
                'last_name' => 'Lahmidi',
                'email' => 'sarah.it@example.com',
                'password' => bcrypt('password123'),
                'phone' => '0611111111',
                'position' => 'Responsable IT',
                'role_id' => 2,
                'department_id' => 1,
                'team_id' => null,
                'profile_picture' => null,
                'status' => 'active',
                'hire_date' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'first_name' => 'Ahmed',
                'last_name' => 'Rami',
                'email' => 'ahmed.rh@example.com',
                'password' => bcrypt('password123'),
                'phone' => '0622222222',
                'position' => 'Responsable RH',
                'role_id' => 2,
                'department_id' => 2,
                'team_id' => null,
                'profile_picture' => null,
                'status' => 'active',
                'hire_date' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'first_name' => 'Nadia',
                'last_name' => 'Fassi',
                'email' => 'nadia.marketing@example.com',
                'password' => bcrypt('password123'),
                'phone' => '0633333333',
                'position' => 'Responsable Marketing',
                'role_id' => 2,
                'department_id' => 3,
                'team_id' => null,
                'profile_picture' => null,
                'status' => 'active',
                'hire_date' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Team leaders (Team Leader)
            ['first_name' => 'Rachid', 'last_name' => 'El Idrissi', 'email' => 'rachid.backend@example.com', 'password' => bcrypt('password123'), 'phone' => '0644444444', 'position' => 'Team Leader Backend', 'role_id' => 3, 'department_id' => 1, 'team_id' => 1,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Samia', 'last_name' => 'Benomar', 'email' => 'samia.recrutement@example.com', 'password' => bcrypt('password123'), 'phone' => '0655555555', 'position' => 'Team Leader Recrutement', 'role_id' => 3, 'department_id' => 2,'team_id' => 3,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Hassan', 'last_name' => 'Majid', 'email' => 'hassan.communication@example.com', 'password' => bcrypt('password123'), 'phone' => '0666666666', 'position' => 'Team Leader Communication', 'role_id' => 3, 'department_id' => 3,'team_id' => 5,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],

            // Membres des équipes (Employés)
            ['first_name' => 'Meriem', 'last_name' => 'Achkar', 'email' => 'meriem.backend@example.com', 'password' => bcrypt('password123'), 'phone' => '0677777777', 'position' => 'Dév. Backend', 'role_id' => 5, 'department_id' => 1,'team_id' => 1,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Samir', 'last_name' => 'Bouzid', 'email' => 'samir.backend@example.com', 'password' => bcrypt('password123'), 'phone' => '0688888888', 'position' => 'Dév. Backend', 'role_id' => 5, 'department_id' => 1, 'team_id' => 1,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Salma', 'last_name' => 'Benali', 'email' => 'salma.frontend@example.com', 'password' => bcrypt('password123'), 'phone' => '0699999999', 'position' => 'Dév. Frontend', 'role_id' => 5, 'department_id' => 1, 'team_id' => 2, 'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Amine', 'last_name' => 'Chafi', 'email' => 'amine.frontend@example.com', 'password' => bcrypt('password123'), 'phone' => '0700000000', 'position' => 'Dév. Frontend', 'role_id' => 5, 'department_id' => 1, 'team_id' => 2, 'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Oussama', 'last_name' => 'Khattabi', 'email' => 'oussama.recruteur@example.com', 'password' => bcrypt('password123'), 'phone' => '0711111111', 'position' => 'Recruteur', 'role_id' => 5, 'department_id' => 2, 'team_id' => 3, 'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Laila', 'last_name' => 'Bakkali', 'email' => 'laila.recruteur@example.com', 'password' => bcrypt('password123'), 'phone' => '0722222222', 'position' => 'Recruteuse', 'role_id' => 5, 'department_id' => 2, 'team_id' => 3, 'profile_picture' => null,'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Nabil', 'last_name' => 'Hajjami', 'email' => 'nabil.coach@example.com', 'password' => bcrypt('password123'), 'phone' => '0733333333', 'position' => 'Coach RH', 'role_id' => 5, 'department_id' => 2,'team_id' => 4, 'profile_picture' => null,'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Hanane', 'last_name' => 'El Alami', 'email' => 'hanane.coach@example.com', 'password' => bcrypt('password123'), 'phone' => '0744444444', 'position' => 'Coach RH', 'role_id' => 5, 'department_id' => 2,'team_id' => 4,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Imane', 'last_name' => 'Slaoui', 'email' => 'imane.communication@example.com', 'password' => bcrypt('password123'), 'phone' => '0755555555', 'position' => 'Spécialiste Communication', 'role_id' => 5, 'department_id' => 3,'team_id' => 5,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Mehdi', 'last_name' => 'Zahidi', 'email' => 'mehdi.communication@example.com', 'password' => bcrypt('password123'), 'phone' => '0766666666', 'position' => 'Chargé Com.', 'role_id' => 5, 'department_id' => 3, 'team_id' => 5,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Yassir', 'last_name' => 'Khalfi', 'email' => 'yassir.redacteur@example.com', 'password' => bcrypt('password123'), 'phone' => '0777777777', 'position' => 'Rédacteur', 'role_id' => 5, 'department_id' => 3,'team_id' => 6,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['first_name' => 'Fatima Zahra', 'last_name' => 'Belkadi', 'email' => 'fatima.redactrice@example.com', 'password' => bcrypt('password123'), 'phone' => '0788888888', 'position' => 'Rédactrice', 'role_id' => 5, 'department_id' => 3,'team_id' => 6,'profile_picture' => null, 'status' => 'active', 'hire_date' => Carbon::now(), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
