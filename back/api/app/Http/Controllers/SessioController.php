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

    //Retornem la sessió + la seva sala + i el plànol de seients ocupats
    public function show($id)
    {
        // Busquem la sessió demanada amb la seva peli i sala
        $sessio = Sessio::with(['pelicula', 'sala'])->findOrFail($id);
        
        // Carreguem TOTS els seients d'aquesta sala concreta
        $seientsSala = Seient::where('sala_id', $sessio->sala_id)->get();
        
        // Mirem a la taula Entrades quins seients ja han estat comprats EXACTAMENT per aquesta sessió
        $seientsCompratsIds = Entrada::where('sessio_id', $id)->pluck('seient_id')->toArray();
        
        
        // 1. Recorrem tots els seients de la sala amb un bucle FOR clàssic (de 0 fins a la quantitat de seients que hi hagi)
        for ($i = 0; $i < count($seientsSala); $i++) {
            
            // Per defecte comencem suposant que el seient NO està ocupat (fals)
            $es_ocupat = false;
            
            // 2. Amb un segon bucle intern, busquem dins la llista de Bitllets Comprats
            for ($j = 0; $j < count($seientsCompratsIds); $j++) {
                
                // Si l'ID del seient de la sala coincideix amb algun ID comprat
                if ($seientsSala[$i]->id == $seientsCompratsIds[$j]) {
                    // Marquem el seient com a venut
                    $es_ocupat = true;
                    // Trenquem aquest bucle petit per no perdre més el temps buscant (el seient ja l'hem trobat)
                    break;
                }
            }
            // I finalment, desem el resultat per aquest seient actuant exactament igual que el transform
            $seientsSala[$i]->ocupat = $es_ocupat;
        }

        // Ho retornem tot ajuntat endreçadament pel frontend
        return response()->json([
            'sessio' => $sessio,
            'seients_mapa' => $seientsSala
        ]);
    }

        // Part d'administracio
    public function store(Request $request)
    {
        $novaSessio = Sessio::create($request->all());
        return response()->json($novaSessio, 201);
    }
    public function update(Request $request, $id)
    {
        $sessio = Sessio::findOrFail($id);
        $sessio->update($request->all());
        return response()->json($sessio);
    }
    public function destroy($id)
    {
        $sessio = Sessio::findOrFail($id);
        $sessio->delete();
        return response()->json(['message' => 'Sessió eliminada amb èxit']);
    }
}
