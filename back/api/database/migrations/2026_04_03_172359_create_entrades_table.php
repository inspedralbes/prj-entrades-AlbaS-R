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
    Schema::create('entrades', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('usuari_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('sessio_id')->constrained('sessions')->onDelete('cascade');
        $table->foreignId('seient_id')->constrained('seients')->onDelete('cascade');
        $table->string('estat_pagament')->default('pendent'); 
        
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrades');
    }
};
