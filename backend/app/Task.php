<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'project_id',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    // 🔗 Relations

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(Employee::class, 'created_by');
    }

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_task');
    }
}
