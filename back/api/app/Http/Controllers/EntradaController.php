<?php

namespace App\Http\Controllers;

use App\Models\Entrada;
use App\Models\Sessio;
use Illuminate\Http\Request;

class EntradaController extends Controller
{
    // Verifica l'ocupació vigent de la butaca i emmagatzema l'entrada objectiva
    public function store(Request $request)
    {
        $request->validate([
            'usuari_id' => 'required|exists:users,id',
            'sessio_id' => 'required|exists:sessions,id',
            'seient_id' => 'required|exists:seients,id',
        ]);

        // Verificació d'estat de seient prèvia per mantenir nivell de concurrència segur.
        $estaOcupat = Entrada::where('sessio_id', $request->sessio_id)
                             ->where('seient_id', $request->seient_id)
                             ->exists();

        if ($estaOcupat) {
            // Emissió d'error 400 per seient no disponible en l'instant de transacció.
            return response()->json([
                'message' => 'El seient especificat ja no es troba disponible.'
            ], 400);
        }

        // Creació oficial del document d'entrada vinculat.
        $entrada = Entrada::create([
            'usuari_id' => $request->usuari_id,
            'sessio_id' => $request->sessio_id,
            'seient_id' => $request->seient_id,
            'estat_pagament' => 'pagat'
        ]);

        return response()->json([
            'message' => 'Transacció acceptada i processada correctament.',
            'entrada' => $entrada
        ], 201);
    }
    
    public function lesMevesEntrades($id)
    {
        // Recuperació integral de l'històric d'adquisicions client 
        $entrades = Entrada::where('usuari_id', $id)
            ->with(['sessio.pelicula', 'sessio.sala', 'seient'])
            ->get();
            
        return response()->json($entrades);
    }
}
