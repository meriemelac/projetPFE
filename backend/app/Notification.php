<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{

    protected $fillable = [
        'employee_id',
        'title',
        'message',
        'is_read',
        'read_at',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
