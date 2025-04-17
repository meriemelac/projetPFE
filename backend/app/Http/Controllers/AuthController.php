<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Employee;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    /**
     * Connexion de l'utilisateur et génération d'un token Sanctum.
     */
    public function login(Request $request)
    {
        // Validation des données envoyées
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Recherche de l'utilisateur
        $employee = Employee::where('email', $request->email)->first();

        // Vérifier si l'utilisateur existe et si le mot de passe est correct
        if (!$employee || !Hash::check($request->password, $employee->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        // Générer un token Sanctum
        $token = $employee->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'email' => $employee->email,
                'role_id' => $employee->role_id,
            ],
        ], 200);
    }

    /**
     * Déconnexion de l'utilisateur (Suppression du token).
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Déconnexion réussie'], 200);
    }

    /**
     * Récupérer l'utilisateur connecté.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
