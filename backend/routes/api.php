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
Route::post('/update-profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');

//Employees
Route::get('/employees', [EmployeeController::class, 'index'])->middleware('auth:sanctum');
Route::post('/employees', [EmployeeController::class, 'store'])->middleware(['auth:sanctum', 'role:1,2', 'check.assignable.role']);
Route::get('/employees/{id}', [EmployeeController::class, 'show'])->middleware(['auth:sanctum', 'role:1,2']);
Route::put('/employees/{id}', [EmployeeController::class, 'update'])->middleware(['auth:sanctum', 'role:1,2', 'check.assignable.role']);
Route::delete('/employees/{id}', [EmployeeController::class, 'destroy'])->middleware(['auth:sanctum', 'role:1,2']);


//Notifications
Route::get('/notifications', [NotificationController::class, 'index']);


//Departements
// Accessible à tous les employés
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/departments', [DepartmentController::class, 'index']);
});
// Accessible uniquement à l'admin
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/departments/{id}', [DepartmentController::class, 'show']);
    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
});


//Projects
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/available-managers', [ProjectController::class, 'availableManagers']);
    Route::get('/projects/available-members', [ProjectController::class, 'availableMembers']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::get('/projects/{id}/members', [ProjectController::class, 'members']);
    
    // restreint aux rôles 1, 2, 3 — la logique est déjà dans le controller
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
});


//Team// Toutes les routes nécessitent une authentification
Route::middleware('auth:sanctum')->group(function () {
    
    // Tous les utilisateurs peuvent voir la liste des équipes accessibles et leurs équipes
    Route::get('/teams', [TeamController::class, 'index']);
    Route::get('/teams/{id}', [TeamController::class, 'show']);
    Route::get('/departments/{id}/teams', [DepartmentController::class, 'getTeams']);
    // Routes réservées à l'admin et au chef de département
    Route::post('/teams', [TeamController::class, 'store']);
    Route::put('/teams/{id}', [TeamController::class, 'update']);
    Route::delete('/teams/{id}', [TeamController::class, 'destroy']);
});

//Task
// Tâches (API REST + Drag & Drop + Assignation)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects/{projectId}/tasks', [TaskController::class, 'index']);
    Route::get('/projects/{id}/tasks/all', [TaskController::class, 'allTasksByProject']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::put('/tasks/{id}/my-status', [TaskController::class, 'updateMyTaskStatus']);
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
