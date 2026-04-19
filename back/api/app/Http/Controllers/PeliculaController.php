<?php

namespace App\Http\Controllers;

use App\Models\Pelicula;
use Illuminate\Http\Request;

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

    // Part d'administració
    public function adminIndex()
    {
        // Les ordenem per les més noves primer
        return response()->json(Pelicula::orderBy('id', 'desc')->get());
    }
    // Crear una nova pel·lícula
    public function store(Request $request)
    {
        // Evitem que destrueixi el fitxer original agafant l'ID d'un text nul i excloent els fitxers físics del desglossament principal  
        $data = $request->except('imatge_url');
        
        // Mirem si hi ha una fotografia per convertir-la físicament
        if ($request->hasFile('imatge_url')) {
            $path = $request->file('imatge_url')->store('cartellera', 'public');
            $data['imatge_url'] = url($path);
        } else {
            // Si li passen un text manual via URL (per exemple des de l'API o un formulari sense fitxer)
            $data['imatge_url'] = $request->input('imatge_url');
        }

        $novaPelicula = Pelicula::create($data);
        return response()->json($novaPelicula, 201);
    }
    // Actualitzar les dades d'una pel·lícula
    public function update(Request $request, $id)
    {
        $pelicula = Pelicula::findOrFail($id);
        $data = $request->except('imatge_url');

        if ($request->hasFile('imatge_url')) {
            $path = $request->file('imatge_url')->store('cartellera', 'public');
            $data['imatge_url'] = url($path);
        } else if ($request->has('imatge_url') && $request->input('imatge_url') != 'null') {
            $data['imatge_url'] = $request->input('imatge_url');
        }

        $pelicula->update($data);
        return response()->json($pelicula);
    }
    // Esborrar una pel·lícula
    public function destroy($id)
    {
        $pelicula = Pelicula::findOrFail($id);
        $pelicula->delete();
        return response()->json(['message' => 'Pel·lícula eliminada amb èxit']);
    }
    
}
