<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function getCommentsForTask($taskId)
    {
        $comments = Comment::with('employee')
            ->where('task_id', $taskId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, $taskId)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment = new Comment([
            'content' => $validated['content'],
            'employee_id' => auth()->id(),
            'task_id' => $taskId
        ]);

        $comment->save();

        return response()->json($comment, 201);
    }
}
