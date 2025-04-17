<?php

namespace App; // ← Corriger le namespace si ton modèle est dans app/Models

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Task;

class Employee extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'position',
        'role_id',
        'department_id',
        'profile_picture',
        'status',
        'hire_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'email_verified_at' => 'datetime',
    ];

    // 🔗 Relations

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function projectsManaged()
    {
        return $this->hasMany(Project::class, 'manager_id');
    }

    public function projectsCreated()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_members');
    }


    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'employee_task');
    }
}
