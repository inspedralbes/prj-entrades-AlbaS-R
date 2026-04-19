<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    use HasFactory;

    protected $table = 'sales';
    protected $guarded = [];

    public function seients() {
        return $this->hasMany(Seient::class);
    }

    public function sessions() {
        return $this->hasMany(Sessio::class);
    }
}
