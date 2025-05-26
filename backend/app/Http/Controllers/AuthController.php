<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Employee;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
        $employee = Employee::with(['role', 'department', 'team'])->find($request->user()->id);

        if (!$employee) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json([
            'id' => $employee->id,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'position' => $employee->position,
            'status' => $employee->status,
            'hire_date' => $employee->hire_date,
            'profile_photo_url' => $employee->profile_picture
                ? asset('storage/' . $employee->profile_picture)
                : null,
            'role' => $employee->role->description ?? null,
            'department' => $employee->department->name ?? null,
            'team' => $employee->team->name ?? null,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $employee = $request->user();

        // Validation des champs modifiables
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:20',
            'profile_picture' => 'nullable|image|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Si une nouvelle image est envoyée
        if ($request->hasFile('profile_picture')) {
            // Supprimer l’ancienne si elle existe
            if ($employee->profile_picture && Storage::disk('public')->exists($employee->profile_picture)) {
                Storage::disk('public')->delete($employee->profile_picture);
            }

            $path = $request->file('profile_picture')->store('profile_photos', 'public');
            $data['profile_picture'] = $path;
        }

        // Mise à jour des champs
        $employee->update($data);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'profile_photo_url' => $employee->profile_picture
                ? asset('storage/' . $employee->profile_picture)
                : null,
        ]);
    }
}
