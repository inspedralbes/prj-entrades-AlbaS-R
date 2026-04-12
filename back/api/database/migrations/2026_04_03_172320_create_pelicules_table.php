<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('pelicules', function (Blueprint $table) {
        $table->id();
        $table->string('titol');
        $table->text('descripcio');
        $table->string('any');
        $table->string('imatge_url');
        $table->string('genere');
        $table->string('director')->nullable(); 
        $table->string('actors')->nullable();
        $table->string('durada')->nullable();
        $table->string('rating')->nullable();
        $table->string('idioma')->nullable();
        $table->string('edat_recomanada')->nullable();
        $table->string('imdb_id')->unique()->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelicules');
    }
};
