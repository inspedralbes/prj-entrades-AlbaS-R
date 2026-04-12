<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrada extends Model
{
    use HasFactory;

    protected $table = 'entrades';
    protected $guarded = [];

    public function usuari() {
        return $this->belongsTo(User::class, 'usuari_id');
    }

    public function sessio() {
        return $this->belongsTo(Sessio::class);
    }

    public function seient() {
        return $this->belongsTo(Seient::class);
    }
}
