<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Sala;
use App\Models\Seient;
use App\Models\Pelicula;
use App\Models\Sessio;
use App\Models\User;
use App\Models\Entrada;
use Carbon\Carbon; // La llibreria de Laravel per manipular dates i hores

class CinemaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear dos usuaris de prova, un admin y un normal

        $usuari = User::firstorCreate(
            ['email' => 'client1@starmovie.cat'],
            [
                'name' => 'Client1',
                'password' => HAsh::make('12345678')
            ]
        );
        //Confirmació de que l'usuari s'ha creat o ja existia
        $this->command->info('Usuari creat o ja existia: ' . $usuari->email);

        $admin = User::firstOrCreate(
            ['email' => 'admin@starmovie.cat'],
            [
                'name' => 'L\'Administrador Totpoderós',
                'password' => Hash::make('12345678'),
                'is_admin' => true
            ]
        );
        $this->command->info("Usuari Administrador creat: " . $admin->email);

        // 2. Crear les sales de exemple

        $nomSales = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Sala VIP'];
        $salesCreades = [];

        foreach($nomSales as $nom){
            $capacitat = ($nom === 'Sala VIP') ? 20 : 50;
            $sala = Sala::firstorCreate(
                ['nom' => $nom],
                ['capacitat' => $capacitat]
            );

            $salesCreades[] = $sala;
            $this->command->info('Sala creada: ' . $sala->nom);

            if($sala -> seients() -> count() === 0 ){
                $files = ($capacitat === 20) ? 4 : 5;
                $seientsPerFila = ($capacitat === 20) ? 5 : 10;

                for ($f = 1; $f <= $files; $f++) {
                    for ($s = 1; $s <= $seientsPerFila; $s++) {
                        Seient::firstOrCreate([

                            'sala_id' => $sala->id,
                            'fila_seient' => $f,
                            'nombre_seient' => $s

                        ]);
                    }
                }
            }
        }
        $this->command->info("Sala muntada completament. {$nom}");

        // 3. Crear Sessions
        $pelicules = Pelicula::inRandomOrder()->limit(5)->get();
        $sessionsCreades = [];
        if ($pelicules->count() > 0) {
            $dies = [Carbon::today(), Carbon::tomorrow()];
            $hores = ['16:00:00', '19:00:00', '22:00:00']; 
            foreach ($salesCreades as $sala) {
                $pelicula = $pelicules->random();
                
                foreach ($dies as $dia) {
                    foreach ($hores as $hora) {
                        $dataHora = Carbon::parse($dia->format('Y-m-d') . ' ' . $hora);
                        
                        $sessio = Sessio::firstOrCreate([
                            'sala_id' => $sala->id,
                            'data_hora' => $dataHora,
                        ], [
                            'pelicula_id' => $pelicula->id,
                            'preu' => ($sala->nom === 'Sala VIP') ? 12.50 : 8.50,
                        ]);
                        $sessionsCreades[] = $sessio;
                    }
                }
            }
            $this->command->info("Horaris muntats! Hem programat " . count($sessionsCreades) . " sessions.");
            
        } else {
            $this->command->error("ATENCIÓ: No has descarregat les pel·lícules encara!");
        }

        // 4. Assignar una Entrada al primer usuari
            
            $sessioExemple = $sessionsCreades[0];
            $seientExemple = $sessioExemple->sala->seients->first();
            
            Entrada::firstOrCreate([
                'usuari_id' => $usuari->id, 
                'sessio_id' => $sessioExemple->id,
                'seient_id' => $seientExemple->id,
            ], [
                'estat_pagament' => 'pagat'
            ]);
            
            $this->command->info("S'ha simulat la venda de la 1a entrada per al client!");

    }
}
