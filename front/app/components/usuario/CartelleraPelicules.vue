<template>
  <div class="cartellera-container">
    <h2>Cartellera disponible</h2>
    <ul class="pelicules-llista">
      <li v-for="pelicula in cinemaStore.pelicules" :key="pelicula.id" class="pelicula-card">
        <img :src="pelicula.imatge_url" :alt="pelicula.titol" class="pelicula-imatge" />

        <div class="pelicula-info">
          <h3>{{ pelicula.titol }} ({{ pelicula.any }})</h3>
          <p class="pelicula-meta"><strong>Gènere:</strong> {{ pelicula.genere }} | <strong>Durada:</strong> {{
            pelicula.durada }}</p>
          <button class="btn-seleccionar" @click="$emit('seleccioPelicula', pelicula)">Revisar horaris i sales</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useCinemaStore } from '../../../stores/cinemaStore';
const cinemaStore = useCinemaStore();

defineEmits(['seleccioPelicula']);
</script>

<style scoped>
.cartellera-container {
  padding-bottom: 40px;
}

.pelicules-llista {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.pelicula-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.pelicula-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.pelicula-imatge {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.pelicula-info {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.pelicula-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.pelicula-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
  flex-grow: 1;
}

.btn-seleccionar {
  background-color: #111;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 600;
  width: 100%;
  transition: background-color 0.2s;
}

.btn-seleccionar:hover {
  background-color: #333;
}
</style>
