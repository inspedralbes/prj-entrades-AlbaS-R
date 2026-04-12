<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use App\Models\Seient;
use App\Models\Sessio;
use Illuminate\Http\Request;

class SalaController extends Controller
{
    // Cridat per retornar absolutament totes les sales a la taula
    public function index()
    {
        return response()->json(Sala::all());
    }

    // El cervell que tradueix la teva petició d'administrador en les butaques físiques de l'arquitectura
    public function store(Request $request)
    {
        // Capturem allò que envia la web
        $nom = $request->input('nom');
        $files = $request->input('files');
        $seients_per_fila = $request->input('seients_per_fila');

        // Multipliquem per saber el volum màxim
        $capacitat_total = $files * $seients_per_fila;

        // 1. Creem l'habitació general de la sala a la BD
        $sala = Sala::create([
            'nom' => $nom,
            'capacitat' => $capacitat_total
        ]);

        // 2. Construïm cada butaca amb la seva fila i columna assignant-li aquest ID de sala
        for ($f = 1; $f <= $files; $f++) {
            for ($s = 1; $s <= $seients_per_fila; $s++) {
                Seient::create([
                    'sala_id' => $sala->id,
                    'fila_seient' => $f,
                    'nombre_seient' => $s
                ]);
            }
        }

        // Retornem només l'habitació general cap a la llista d'adalt
        return response()->json($sala, 201);
    }

    // Un esborrador extremament curós demanat expressament.
    public function destroy($id)
    {
        // Primer, contem si hi ha sessions lligades a aquesta per evitar hecatombes d'entrades.
        $sessionsActives = Sessio::where('sala_id', $id)->count();

        // Escut de seguretat activat: Avortem si perilla algun horari existent!
        if ($sessionsActives > 0) {
            return response()->json(['message' => 'Seguretat Ocupacional: Aquesta sala ja té sessions programades o utilitzades per usuaris.'], 403);
        }

        $sala = Sala::findOrFail($id);
        
        // En esborrar, com que a la migració de la base de dades tenim "onDelete('cascade')",
        // Laravel decapitarà elegantment tots els seus seients per evitar fantasmes.
        $sala->delete();

        return response()->json(['message' => 'Sala destruïda adequadament del mapa de l\'edifici.']);
    }
}
