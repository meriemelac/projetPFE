<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    public function getCommentsForTask($id): JsonResponse
    {
        $task = Task::with('comments.employee')->findOrFail($id);

        return response()->json([
            'comments' => $task->comments
        ]);
    }
}
