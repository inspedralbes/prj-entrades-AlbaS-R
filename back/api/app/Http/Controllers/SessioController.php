<?php

namespace App\Http\Controllers;

use App\Models\Sessio;
use App\Models\Seient;
use App\Models\Entrada;
use Illuminate\Http\Request;

class SessioController extends Controller
{
    // Llistar totes les sessions amb la info de la peli i la sala
    public function index(Request $request)
    {
        $query = Sessio::with(['pelicula', 'sala']);

        // Si des de la web només volem les sessions d'una peli en particular: 
        // trucarem a /api/sessions?pelicula_id=3
        if ($request->has('pelicula_id')) {
            $query->where('pelicula_id', $request->pelicula_id);
        }

        $sessions = $query->orderBy('data_hora', 'asc')->get();

        return response()->json($sessions);
    }

    // Màgia: Retornem la sessió + la seva sala + i el plànol de seients ocupats
    public function show($id)
    {
        // Busquem la sessió demanada amb la seva peli i sala
        $sessio = Sessio::with(['pelicula', 'sala'])->findOrFail($id);
        
        // Carreguem TOTS els seients d'aquesta sala concreta
        $seientsSala = Seient::where('sala_id', $sessio->sala_id)->get();
        
        // Mirem a la taula Entrades quins seients ja han estat comprats EXACTAMENT per aquesta sessió
        $seientsCompratsIds = Entrada::where('sessio_id', $id)->pluck('seient_id')->toArray();
        
        // Creem el "variable virtual" anomenat ocupat per pintar al Frontend
        $seientsSala->transform(function ($seient) use ($seientsCompratsIds) {
            $seient->ocupat = in_array($seient->id, $seientsCompratsIds);
            return $seient;
        });

        // Ho retornem tot ajuntat endreçadament pel frontend
        return response()->json([
            'sessio' => $sessio,
            'seients_mapa' => $seientsSala
        ]);
    }
}
