<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
    ];

    public function sender()
    {
        return $this->belongsTo(Employee::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(Employee::class, 'receiver_id');
    }
}
