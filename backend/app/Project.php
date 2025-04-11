<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{

    protected $fillable = [
        'title',
        'description',
        'status',
        'start_date',
        'end_date',
        'manager_id',
        'created_by',
        'team_id',
    ];

    // Relations
    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function creator()
    {
        return $this->belongsTo(Employee::class, 'created_by');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function members()
    {
        return $this->belongsToMany(Employee::class, 'project_members')
            ->withPivot('role')
            ->withTimestamps();
    }
}
