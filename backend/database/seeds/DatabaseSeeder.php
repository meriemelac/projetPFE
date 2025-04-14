<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            EmployeeSeeder::class,
            NotificationSeeder::class,
            TeamSeeder::class,
            EmployeeTeamSeeder::class,
            ProjectSeeder::class,
            TaskSeeder::class,
            CommentSeeder::class,
            ProjectMemberSeeder::class,
            PermissionSeeder::class,
        ]);
    }
}