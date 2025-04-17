<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        DB::table('departments')->truncate(); // Vide la table

        DB::table('departments')->insert([
            ['id' => 1, 'name' => 'IT', 'description' => 'Département Informatique'],
            ['id' => 2, 'name' => 'RH', 'description' => 'Département Ressources Humaines'],
            ['id' => 3, 'name' => 'Marketing', 'description' => 'Département Marketing'],
        ]);
        
    }
}
