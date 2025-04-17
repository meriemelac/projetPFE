<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RoleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

//Employees
Route::get('/employees', [EmployeeController::class, 'index'])->middleware('auth:sanctum');
Route::post('/employees', [EmployeeController::class, 'store'])->middleware(['auth:sanctum', 'role:1,2']);
Route::get('/employees/{id}', [EmployeeController::class, 'show'])->middleware(['auth:sanctum', 'role:1,2']);
Route::put('/employees/{id}', [EmployeeController::class, 'update'])->middleware(['auth:sanctum', 'role:1,2']);
Route::delete('/employees/{id}', [EmployeeController::class, 'destroy'])->middleware(['auth:sanctum', 'role:1,2']);


//Notifications
Route::get('/notifications', [NotificationController::class, 'index']);


//Departements
Route::get('/departments', [DepartmentController::class, 'index'])->middleware('auth:sanctum');

//Projects
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);
Route::get('/projects/{id}/members', [ProjectController::class, 'members']);
Route::post('/projects', [ProjectController::class, 'store'])->middleware('auth:sanctum');


//Team
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/teams/{id}', [TeamController::class, 'show']);
Route::get('/departments/{id}/teams', [DepartmentController::class, 'getTeams']);

//Task
// Tâches (API REST + Drag & Drop + Assignation)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects/{projectId}/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    Route::put('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
    Route::post('/tasks/{task}/assign', [TaskController::class, 'assignEmployees']);
    // Route::post('/tasks/{task}/comments', [CommentController::class, 'store']);
    Route::get('/projects/{projectId}/my-tasks', [TaskController::class, 'myTasksByProject']);
});


//Comments
Route::get('/tasks/{taskId}/comments', [CommentController::class, 'getCommentsForTask'])->middleware('auth:sanctum');
Route::post('/tasks/{taskId}/comments', [CommentController::class, 'store'])->middleware('auth:sanctum');

//Roles
Route::get('/roles', [RoleController::class, 'index']);
