<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CommentSeeder extends Seeder
{
    public function run()
    {
        DB::table('comments')->insert([
            [
                'content' => 'Je vais commencer cette tâche aujourd’hui.',
                'employee_id' => 1,
                'task_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // [
            //     'content' => 'Merci pour l’assignation, je la prends en charge.',
            //     'employee_id' => 2,
            //     'task_id' => 1,
            //     'created_at' => Carbon::now(),
            //     'updated_at' => Carbon::now(),
            // ]
        ]);
    }
}
