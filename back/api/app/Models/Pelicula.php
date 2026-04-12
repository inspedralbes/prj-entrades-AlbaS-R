<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelicula extends Model
{
    use HasFactory;

    protected $table = 'pelicules';

    protected $fillable = [
        'titol',
        'descripcio',
        'any',
        'imatge_url',
        'genere',
        'director',
        'actors',
        'durada',
        'rating',
        'idioma',
        'edat_recomanada',
        'imdb_id'
    ];    public function sessions() {
        return $this->hasMany(Sessio::class);
    }
}
