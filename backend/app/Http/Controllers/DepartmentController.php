<?php

namespace App\Http\Controllers;

use App\Department;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        $departments = Department::all();

        return response()->json([
            'departments' => $departments,
        ]);
    }
}
