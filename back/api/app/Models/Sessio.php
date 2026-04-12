<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sessio extends Model
{
    use HasFactory;

    protected $table = 'sessions';
    protected $guarded = [];

    protected $casts = [
        'data_hora' => 'datetime',
    ];

    public function pelicula() {
        return $this->belongsTo(Pelicula::class);
    }

    public function sala() {
        return $this->belongsTo(Sala::class);
    }

    public function entrades() {
        return $this->hasMany(Entrada::class);
    }
}
