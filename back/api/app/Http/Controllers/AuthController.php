<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Registra un usuari
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => false // Sempre es crea com a client per defecte
        ]);

        return response()->json([
            'message' => 'Usuari creat amb èxit',
            'user' => $user
        ], 201);
    }

    // Login senzill. Comprova el correu i la contrasenya i et retorna les dades
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // Si l'usuari no existeix o la contrasenya no quadra...
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credencials incorrectes!'
            ], 401);
        }

        // Retornem tot l'usuari (nom, id, i si és admin). El frontend s'ho pot guardar a LocalStorage!
        return response()->json([
            'message' => 'Login correcte',
            'user' => $user
        ]);
    }
}
