<?php

namespace App\Http\Controllers;

use App\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        // Tu peux filtrer ici selon l'employé connecté si tu utilises l'auth
        $notifications = Notification::latest()->get();

        return response()->json([
            'notifications' => $notifications,
        ]);
    }
}
