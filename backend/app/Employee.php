<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

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
        'profile_picture',
        'status',
        'hire_date',   
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}