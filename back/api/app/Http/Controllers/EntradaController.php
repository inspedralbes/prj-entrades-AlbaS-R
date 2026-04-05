<?php

namespace App\Http\Controllers;

use App\Models\Entrada;
use App\Models\Sessio;
use Illuminate\Http\Request;

class EntradaController extends Controller
{
    // Funció per verificar l'ocupació i comprar el tiquet!
    public function store(Request $request)
    {
        $request->validate([
            'usuari_id' => 'required|exists:users,id',
            'sessio_id' => 'required|exists:sessions,id',
            'seient_id' => 'required|exists:seients,id',
        ]);

        // Evitem el desastre: Comprovem que algú no ens hagi pres el lloc un segon abans!
        $estaOcupat = Entrada::where('sessio_id', $request->sessio_id)
                             ->where('seient_id', $request->seient_id)
                             ->exists();

        if ($estaOcupat) {
            // Retornem error HTTP 400 avisant al javascript que cancel·li l'operació
            return response()->json([
                'message' => 'Quin greu! Aquest seient acaba de ser ocupat per algú altre.'
            ], 400);
        }

        // Si tot és lliure, creem l'Entrada!
        $entrada = Entrada::create([
            'usuari_id' => $request->usuari_id,
            'sessio_id' => $request->sessio_id,
            'seient_id' => $request->seient_id,
            'estat_pagament' => 'pagat'
        ]);

        return response()->json([
            'message' => "Perfecte! L'entrada és teva.",
            'entrada' => $entrada
        ], 201);
    }
}
