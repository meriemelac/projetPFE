<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:employees,id',
            'message' => 'required|string',
        ]);

        $senderId = auth()->id();
        $receiverId = $request->receiver_id;
        $message = $request->message;

        // Optionnel : sauvegarder le message en base de données ici

        broadcast(new MessageSent($message, $senderId, $receiverId))->toOthers();

        return response()->json(['status' => 'Message sent!']);
    }
}
