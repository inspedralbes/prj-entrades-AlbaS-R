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
