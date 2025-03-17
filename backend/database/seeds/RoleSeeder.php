<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Add your roles here
        DB::table('roles')->insert([
            ['name' => 'superadmin', 'description' => 'This user has all permissions','created_at' => now(), 'updated_at' => now()],
        ]);
    }
}