<template>
  <div>
    <h1>Benvinguts a StarMovie Cartellera!</h1>
    
    <div v-if="cinemaStore.carregant">
      <p>Carregant dades fresques de la nostra base de dades...</p>
    </div>
    
    <!-- PAS 1: MOSTRAR CARTELLERA -->
    <div v-else-if="vistaActual === 'cartellera'">
      <h2>La nostra Cartellera Completa</h2>
      <ul>
        <!-- Modifiquem el v-for per pintar cada pel·lícula -->
        <li v-for="pelicula in cinemaStore.pelicules" :key="pelicula.id">
          <h3>{{ pelicula.titol }} ({{ pelicula.any }})</h3>
          <p><strong>Gènere:</strong> {{ pelicula.genere }} | <strong>Durada:</strong> {{ pelicula.durada }}</p>
          <img :src="pelicula.imatge_url" :alt="pelicula.titol" height="150" />
          <br><br>
          <button @click="seleccionarPelicula(pelicula)">Veure Sessions d'aquesta Peli</button>
          <hr />
        </li>
      </ul>
    </div>

    <!-- PAS 2: MOSTRAR SESSIONS DE LA PELI SELECCIONADA -->
    <div v-else-if="vistaActual === 'sessions'">
      <button @click="vistaActual = 'cartellera'">⬅ Tornar a la cartellera</button>
      <h2>Sessions per: {{ peliculaActiva?.titol }}</h2>
      
      <p v-if="cinemaStore.sessions.length === 0">Ooops! No hi ha sessions programades per aquesta pel·lícula. Tries una altra?</p>
      
      <ul>
        <li v-for="sessio in cinemaStore.sessions" :key="sessio.id">
          <p><strong>Dia i Hora:</strong> {{ sessio.data_hora }} </p>
          <p><strong>Sala:</strong> {{ sessio.sala.nom }} ({{ sessio.sala.nom === 'Sala VIP' ? 'BUTACA DE LUXE' : 'Estàndard' }})</p>
          <p><strong>Preu:</strong> {{ sessio.preu }} €</p>
          <button @click="seleccionarSessio(sessio.id)">Tria els Seients</button>
          <hr />
        </li>
      </ul>
    </div>

    <!-- PAS 3: PASSAREL·LA DE SEIENTS -->
    <div v-else-if="vistaActual === 'seients'">
      <button @click="vistaActual = 'sessions'">⬅ Tornar a horaris</button>
      <h2>Escull el teu lloc! ({{ cinemaStore.sessioActiva?.sala?.nom }})</h2>
      
      <!-- Pintem els seients súper cutrement en llista d'HTML pur -->
      <ul>
        <li v-for="seient in cinemaStore.seients" :key="seient.id">
          Fila: {{ seient.fila_seient }} - Seient: {{ seient.nombre_seient }}
          
          <span v-if="seient.ocupat" style="color: red; margin-left: 10px;">❌ OCUPAT</span>
          <button v-else style="color: green; margin-left: 10px;" @click="comprarSeient(seient)">Lliure! COMPRAR 🎟</button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCinemaStore } from '../stores/cinemaStore';

const cinemaStore = useCinemaStore();

// Amb això controlem quina "pantalla" estem mostrant!
const vistaActual = ref('cartellera'); // Pot ser: 'cartellera', 'sessions', 'seients'
const peliculaActiva = ref(null);

onMounted(() => {
  cinemaStore.fetchPelicules();
});

// Quan l'usuari clica al botó de "Veure sessions" d'una pel·lícula
const seleccionarPelicula = async (pelicula) => {
  peliculaActiva.value = pelicula;
  await cinemaStore.fetchSessions(pelicula.id); // Traguem totes les sessions!
  vistaActual.value = 'sessions'; // Canviem la pantalla "com per art de màgia" sense refrescar el navegador!
};

// Quan l'usuari clica sobre en un horari en concret
const seleccionarSessio = async (sessioId) => {
  await cinemaStore.fetchSeients(sessioId);
  vistaActual.value = 'seients';
};

const comprarSeient = (seient) => {
  alert(`Perfecte! Acabes de reservar un bitllet per a la FILA ${seient.fila_seient}, BUTACA ${seient.nombre_seient}. Ara et demanarem login.`);
  // Aquí aviat hi muntarem l'script que cridi al teu EntradaController php de Laravel.
};
</script>
