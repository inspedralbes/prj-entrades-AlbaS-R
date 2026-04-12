<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Pelicula;

class PeliculesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clau API desde env
        $apiKey = env('OMDB_API_KEY');

        // 2. Paraules clau genèriques o sagues per extreure'n grups de 10 pel·lícules aprox cadascuna
        $searchTerms = [
            'Batman',
            'Spider-Man',
            'Star Wars',
            'Harry Potter',
            'Lord of the rings',
            'Matrix',
            'Avengers',
            'Jurassic',
            'Mission Impossible',
            'X-Men'
        ];

        foreach ($searchTerms as $term) {
            $this->command->info("Buscant pel·lícules sobre: {$term}...");

            // Pas 1: Fem una cerca general (retorna llista bàsica de fins a 10 resultats)
            $searchResponse = Http::get("http://www.omdbapi.com/?s=" . urlencode($term) . "&type=movie&apikey={$apiKey}");

            if ($searchResponse->successful()) {
                $searchData = $searchResponse->json();

                if (isset($searchData['Response']) && $searchData['Response'] === "True") {

                    // Agafem l'array de pel·lícules que ha trobat
                    $movies = $searchData['Search'];

                    foreach ($movies as $movieBasicData) {

                        $imdbId = $movieBasicData['imdbID'];

                        // Ens assegurem de no inserir-la si ja l'hem descarregat prèviament
                        if (!Pelicula::where('imdb_id', $imdbId)->exists()) {

                            // Pas 2: Fem la trucada pel detall COMPLET (Actors, Sinopsi...) usant l'imdbID ('i=')
                            $detailResponse = Http::get("http://www.omdbapi.com/?i={$imdbId}&apikey={$apiKey}");

                            if ($detailResponse->successful()) {
                                $data = $detailResponse->json();

                                if (isset($data['Response']) && $data['Response'] === "True") {
                                    // La guardem a la base de dades
                                    Pelicula::create([
                                        'titol' => $data['Title'],
                                        'descripcio' => $data['Plot'] !== 'N/A' ? $data['Plot'] : 'Sense descripció.',
                                        'any' => $data['Year'],
                                        'imatge_url' => $data['Poster'] !== 'N/A' ? $data['Poster'] : 'https://via.placeholder.com/300x450?text=Sense+Imatge',
                                        'genere' => $data['Genre'],
                                        'director' => $data['Director'] !== 'N/A' ? $data['Director'] : null,
                                        'actors' => $data['Actors'] !== 'N/A' ? $data['Actors'] : null,
                                        'durada' => $data['Runtime'] !== 'N/A' ? $data['Runtime'] : null,
                                        'rating' => isset($data['Ratings'][0]['Value']) ? $data['Ratings'][0]['Value'] : null,
                                        'idioma' => $data['Language'] !== 'N/A' ? $data['Language'] : null,
                                        'edat_recomanada' => $data['Rated'] !== 'N/A' ? $data['Rated'] : null,
                                        'imdb_id' => $data['imdbID']
                                    ]);

                                    $this->command->line("   - Guardada: " . $data['Title']);
                                }
                            }
                        }
                    }
                }
            }
        }

        $this->command->info("Cartellera omplerta amb èxit! Has baixat gairebé 100 pel·lícules.");
    }
}
