<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Employee;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Connexion de l'utilisateur avec l'email et le mot de passe.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        // Validation des données envoyées par l'utilisateur
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Vérification des informations d'identification
        $employee = Employee::where('email', $request->email)->first();

        // Vérifier si l'utilisateur existe et si le mot de passe est correct
        if ($employee && Hash::check($request->password, $employee->password)) {
            // Authentification réussie
            Auth::login($employee);
            return response()->json(['message' => 'Connexion réussie'], 200);
        }

        // Si les informations sont incorrectes
        return response()->json(['message' => 'Identifiants invalides'], 401);
    }

    /**
     * Déconnexion de l'utilisateur.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Déconnexion réussie'], 200);
    }
}
