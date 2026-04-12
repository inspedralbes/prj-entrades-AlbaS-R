<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PeliculaController;
use App\Http\Controllers\SessioController;
use App\Http\Controllers\EntradaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Aquests endpoints conformen la API REST del teu cinema. Retornen
| l'estructura JSON per ser processada per la teva web en JavaScript/React/Vue.
*/

// Sistema d'Usuaris (Login i Registre)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Cartellera
Route::get('/pelicules', [PeliculaController::class, 'index']);
Route::get('/pelicules/{id}', [PeliculaController::class, 'show']);

// Horaris i Sales (Sessions)
Route::get('/sessions', [SessioController::class, 'index']);
Route::get('/sessions/{id}', [SessioController::class, 'show']);

// Rutes per a usuaris registrats i gestió d'entrades
Route::post('/entrades', [EntradaController::class, 'store']);
Route::get('/entrades/usuari/{id}', [EntradaController::class, 'lesMevesEntrades']);


Route::middleware(['auth:sanctum', \App\Http\Middleware\IsAdmin::class])->group(function () {

    // Obtenir TOTES les pel·lícules (fins i tot les que no tenen sessió)
    Route::get('/admin/pelicules', [\App\Http\Controllers\PeliculaController::class, 'adminIndex']);

    // Crear, actualitzar i esborrar Pel·lícules
    Route::post('/admin/pelicules', [\App\Http\Controllers\PeliculaController::class, 'store']);
    Route::put('/admin/pelicules/{id}', [\App\Http\Controllers\PeliculaController::class, 'update']);
    Route::delete('/admin/pelicules/{id}', [\App\Http\Controllers\PeliculaController::class, 'destroy']);

    // Crear, actualitzar i esborrar Sessions
    Route::post('/admin/sessions', [\App\Http\Controllers\SessioController::class, 'store']);
    Route::put('/admin/sessions/{id}', [\App\Http\Controllers\SessioController::class, 'update']);
    Route::delete('/admin/sessions/{id}', [\App\Http\Controllers\SessioController::class, 'destroy']);
    
    // Llistar, Crear i Esborrar Sales
    Route::get('/admin/sales', [\App\Http\Controllers\SalaController::class, 'index']);
    Route::post('/admin/sales', [\App\Http\Controllers\SalaController::class, 'store']);
    Route::delete('/admin/sales/{id}', [\App\Http\Controllers\SalaController::class, 'destroy']);


});