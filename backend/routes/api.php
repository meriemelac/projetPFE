<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\API\MessageController;

// Broadcasting route
Broadcast::routes(['middleware' => ['auth:sanctum']]);

//Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::post('/update-profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');

//messages
Route::get('/messages/{receiverId}', [ChatController::class, 'getMessages'])->middleware('auth:sanctum');
Route::post('/messages', [ChatController::class, 'sendMessage'])->middleware('auth:sanctum');

//Employees
Route::get('/employees', [EmployeeController::class, 'index'])->middleware('auth:sanctum');
Route::post('/employees', [EmployeeController::class, 'store'])->middleware(['auth:sanctum', 'role:1,2', 'check.assignable.role']);
Route::get('/employees/{id}', [EmployeeController::class, 'show'])->middleware(['auth:sanctum', 'role:1,2']);
Route::put('/employees/{id}', [EmployeeController::class, 'update'])->middleware(['auth:sanctum', 'role:1,2', 'check.assignable.role']);
Route::delete('/employees/{id}', [EmployeeController::class, 'destroy'])->middleware(['auth:sanctum', 'role:1,2']);

//Notifications
Route::get('/notifications', [NotificationController::class, 'index']);

//Departements
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/departments', [DepartmentController::class, 'index']);
});
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
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
});

//Team
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/teams', [TeamController::class, 'index']);
    Route::get('/teams/{id}', [TeamController::class, 'show']);
    Route::get('/departments/{id}/teams', [DepartmentController::class, 'getTeams']);
    Route::post('/teams', [TeamController::class, 'store']);
    Route::put('/teams/{id}', [TeamController::class, 'update']);
    Route::delete('/teams/{id}', [TeamController::class, 'destroy']);
});

//Task
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
    Route::get('/projects/{projectId}/my-tasks', [TaskController::class, 'myTasksByProject']);
});

//Comments
Route::get('/tasks/{taskId}/comments', [CommentController::class, 'getCommentsForTask'])->middleware('auth:sanctum');
Route::post('/tasks/{taskId}/comments', [CommentController::class, 'store'])->middleware('auth:sanctum');

//Roles
Route::get('/roles', [RoleController::class, 'index']);