<?php

namespace App\Http\Controllers;

use App\Models\Pelicula;

class PeliculaController extends Controller
{
    // Llista tota la cartellera
    public function index()
    {
        // Retorna totes les pelis amb tota la seva info en format JSON
        $pelicules = Pelicula::all();
        
        return response()->json($pelicules);
    }

    // Retorna els detalls d'una sola peli per mostrar-ne la fitxa sencera
    public function show($id)
    {
        $pelicula = Pelicula::findOrFail($id);
        
        return response()->json($pelicula);
    }
}
