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
    Schema::create('seients', function (Blueprint $table) {
        $table->id();
        $table->foreignId('sala_id')->constrained('sales')->onDelete('cascade');
        $table->integer('fila_seient');
        $table->integer('nombre_seient');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seients');
    }
};
