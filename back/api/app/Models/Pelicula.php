<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelicula extends Model
{
    use HasFactory;

    protected $table = 'pelicules';

    protected $guarded = []; 
    public function sessions() {
        return $this->hasMany(Sessio::class);
    }
}
