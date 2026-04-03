<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('sessions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('pelicula_id')->constrained('pelicules')->onDelete('cascade');
        $table->foreignId('sala_id')->constrained('sales')->onDelete('cascade');
        $table->dateTime('data_hora');
        $table->decimal('preu', 8, 2)->default(0);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
