<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProjectMemberSeeder extends Seeder
{
    public function run()
    {
        DB::table('project_members')->insert([
            [
                'employee_id' => 1,
                'project_id' => 1,
                'role' => 'Développeur',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // [
            //     'employee_id' => 3,
            //     'project_id' => 1,
            //     'role' => 'Testeur',
            //     'created_at' => Carbon::now(),
            //     'updated_at' => Carbon::now(),
            // ]
        ]);
    }
}
