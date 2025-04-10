<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('notifications')->insert([
            [
                'employee_id' => 1,
                'title' => 'Nouvelle tâche assignée',
                'message' => 'Vous avez été assigné à la tâche "Développement de l\'API".',
                'is_read' => false,
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'employee_id' => 1,
                'title' => 'Réunion d\'équipe demain',
                'message' => 'Rappel : une réunion est prévue demain à 10h avec toute l\'équipe.',
                'is_read' => true,
                'read_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
