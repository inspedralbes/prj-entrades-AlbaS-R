<template>
  <div>
    <button @click="$emit('tornar')" class="btn-back">⬅ Tornar a la cartellera</button>
    <h2>Sessions confirmades: {{ peliculaActiva?.titol }}</h2>
    
    <p v-if="cinemaStore.sessions.length === 0" class="missatge-buit">Sense resultats d'horaris per a aquesta selecció.</p>
    
    <ul class="sessions-llista">
      <li v-for="sessio in cinemaStore.sessions" :key="sessio.id" class="sessio-card">
        <div class="sessio-detalls">
            <p><strong>Programa i Horari:</strong> {{ sessio.data_hora }} </p>
            <p><strong>Sala:</strong> <span class="badge-sala">{{ sessio.sala.nom }} ({{ sessio.sala.nom === 'Sala VIP' ? 'Entorn Luxury' : 'Bàsic' }})</span></p>
            <p><strong>Tarifa de pagament:</strong> <span class="preu">{{ sessio.preu }} €</span></p>
        </div>
        <button class="btn-seleccionar-seients" @click="$emit('seleccioSessio', sessio.id)">Tria la localitat de butaques</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useCinemaStore } from '../../../stores/cinemaStore';
const cinemaStore = useCinemaStore();

defineProps({
  peliculaActiva: Object
});

defineEmits(['tornar', 'seleccioSessio']);
</script>

<style scoped>
.btn-back {
  background: #fff;
  border: 1px solid #ccc;
  padding: 8px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #f0f0f0;
}

.missatge-buit {
  padding: 20px;
  background: #fff3cd;
  color: #856404;
  border-radius: 4px;
  text-align: center;
}

.sessions-llista {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sessio-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.sessio-detalls p {
  margin: 5px 0;
  color: #444;
}

.badge-sala {
  background: #e9ecef;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.85em;
  font-weight: 600;
}

.preu {
  color: #28a745;
  font-weight: bold;
  font-size: 1.1em;
}

.btn-seleccionar-seients {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-seleccionar-seients:hover {
  background-color: #0056b3;
}
</style>
