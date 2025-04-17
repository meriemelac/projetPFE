<?php

namespace App\Http\Controllers;

use App\Role;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::all());
    }
}
