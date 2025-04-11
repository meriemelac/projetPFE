<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EmployeeTeamSeeder extends Seeder
{
    public function run()
    {
        DB::table('employee_team')->insert([
            'employee_id' => 1,
            'team_id' => 1, // équipe existante
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
