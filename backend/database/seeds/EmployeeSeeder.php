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
                'position' => 'Director General',
                'role_id' => 1,
                'department_id' => null,
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
                'position' => 'développeur',
                'role_id' => 4,
                'department_id' => null,
                'profile_picture' => null,
                'status' => 'active',
                'hire_date' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
