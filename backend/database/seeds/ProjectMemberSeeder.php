<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProjectMemberSeeder extends Seeder
{
    public function run()
    {
        DB::table('project_members')->insert([
            ['employee_id' => 8, 'project_id' => 1], // Meriem
            ['employee_id' => 9, 'project_id' => 1], // Samir
            ['employee_id' => 10, 'project_id' => 1], // Salma
            ['employee_id' => 13, 'project_id' => 1], // Laila
            ['employee_id' => 16, 'project_id' => 1], // Imane
        ]);
    }
}
