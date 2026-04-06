<?php

namespace App\Http\Controllers;

use App\Models\Pelicula;

class PeliculaController extends Controller
{
    // Llista tota la cartellera
    public function index()
    {
        // Retorna exclusivament les pelis que tinguin 1 o més Sessions pre-assignades
        $pelicules = Pelicula::has('sessions')->get();
        
        return response()->json($pelicules);
    }

    // Retorna els detalls d'una sola peli per mostrar-ne la fitxa sencera
    public function show($id)
    {
        $pelicula = Pelicula::findOrFail($id);
        
        return response()->json($pelicula);
    }
}
