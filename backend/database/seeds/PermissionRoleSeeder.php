<?php

use Illuminate\Database\Seeder;
use App\Role;
use App\Permission;

class PermissionRoleSeeder extends Seeder
{
    public function run(): void
    {
        $permissionsByRole = [
            'admin' => Permission::all()->pluck('id')->toArray(),
        
            'department_leader' => [
                'view_departments',
                'view_employees',
                'view_teams',
                'view_projects',
                'view_tasks',
                'view_comments',
            ],
        
            'team_leader' => [
                'view_employees',
                'view_teams',
                'assign_employees_to_team',
                'view_projects',
                'view_tasks',
                'assign_task',
                'view_comments',
            ],
        
            // 'project_leader' => [
            //     'view_projects',
            //     'create_project',
            //     'edit_project',
            //     'delete_project',
            //     'assign_team_to_project',
            //     'add_members_to_project',
            //     'view_tasks',
            //     'create_task',
            //     'edit_task',
            //     'delete_task',
            //     'assign_task',
            //     'change_task_status',
            //     'view_comments',
            //     'add_comment',
            //     'delete_comment',
            // ],
        
            'employee' => [
                'view_projects',
                'view_tasks',
                'view_comments',
                'add_comment',
            ]
        ];
        

        foreach ($permissionsByRole as $roleName => $permissionNamesOrIds) {
            $role = Role::where('name', $roleName)->first();

            if (!$role) continue;

            // Convertir noms → ids si nécessaire
            if (is_array($permissionNamesOrIds) && is_string($permissionNamesOrIds[0] ?? '')) {
                $ids = Permission::whereIn('name', $permissionNamesOrIds)->pluck('id')->toArray();
            } else {
                $ids = $permissionNamesOrIds;
            }

            $role->permissions()->sync($ids);
        }
    }
}
