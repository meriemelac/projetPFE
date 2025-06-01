<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Envoi d'un message entre deux employés
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:employees,id',
            'message' => 'required|string',
        ]);

        $senderId = auth()->id();
        $receiverId = $request->receiver_id;
        $messageText = $request->message;

        // ✅ Sauvegarder le message
        $message = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'message' => $messageText,
        ]);

        // ✅ Émettre l'événement
        broadcast(new MessageSent($messageText, $senderId, $receiverId))->toOthers();

        return response()->json($message);
    }

    /**
     * Récupérer les messages échangés avec un autre employé
     */
    public function getMessages($receiverId)
    {
        $senderId = auth()->id();

        $messages = Message::where(function ($query) use ($senderId, $receiverId) {
                $query->where('sender_id', $senderId)
                      ->where('receiver_id', $receiverId);
            })
            ->orWhere(function ($query) use ($senderId, $receiverId) {
                $query->where('sender_id', $receiverId)
                      ->where('receiver_id', $senderId);
            })
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }
}
