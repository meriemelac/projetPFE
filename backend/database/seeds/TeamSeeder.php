<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('teams')->truncate();

        DB::table('teams')->insert([
            ['id' => 1, 'name' => 'Développement', 'department_id' => 1],
            ['id' => 2, 'name' => 'Testing', 'department_id' => 1],
            ['id' => 3, 'name' => 'Recrutement', 'department_id' => 2],
            ['id' => 4, 'name' => 'Formation RH', 'department_id' => 2],
            ['id' => 5, 'name' => 'Communication', 'department_id' => 3],
            ['id' => 6, 'name' => 'Contenu Digital', 'department_id' => 3],
        ]);
        
    }
}
