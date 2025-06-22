<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    use HasApiTokens;
    /**
     * Connexion de l'utilisateur et génération d'un token Sanctum.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $employee = Employee::where('email', $request->email)->first();

        if (!$employee || !Hash::check($request->password, $employee->password)) {
            return response()->json(['message' => 'Email ou mot de passe invalide'], 401);
        }

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
        ]);
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
                ? env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $employee->profile_picture
                : null,

            'role' => $employee->role->description ?? null,
            'department' => $employee->department->name ?? null,
            'team' => $employee->team->name ?? null,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $employee = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:20',
            'profile_picture' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('profile_picture')) {
            // Supprimer l'ancienne image depuis S3
            if ($employee->profile_picture && Storage::disk('s3')->exists($employee->profile_picture)) {
                Storage::disk('s3')->delete($employee->profile_picture);
            }

            // Sauvegarder la nouvelle image sur S3
            $path = $request->file('profile_picture')->store('profile_photos', 's3');
            $data['profile_picture'] = $path;
        }

        $employee->update($data);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'profile_photo_url' => $employee->profile_picture
                ? env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $employee->profile_picture
                : null,
        ]);
    }
}
