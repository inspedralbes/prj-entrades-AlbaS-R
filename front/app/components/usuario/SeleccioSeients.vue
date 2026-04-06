<template>
  <div>
    <button @click="$emit('tornar')" class="btn-back">⬅ Tornar a la selecció d'horari</button>
    
    <h2>Ocupació al moment ({{ cinemaStore.sessioActiva?.sala?.nom }})</h2>
    
    <ul class="seient-llista">
      <li v-for="seient in cinemaStore.seients" :key="seient.id" class="seient-item">
        <div class="seient-info">
            Fila de situació: <strong>{{ seient.fila_seient }}</strong> - N°: <strong>{{ seient.nombre_seient }}</strong>
        </div>
        
        <span v-if="seient.ocupat" class="badge-ocupat">OCUPADA</span>
        <button v-else class="btn-comprar" @click="$emit('comprar', seient)">A LLIURE DISPOSICIÓ - COMPRAR</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useCinemaStore } from '../../../stores/cinemaStore';
const cinemaStore = useCinemaStore();

defineEmits(['tornar', 'comprar']);
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

.seient-llista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.seient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
}

.seient-item:nth-child(even) {
  background: #fafafa;
}

.seient-info {
  flex-grow: 1;
}

.badge-ocupat {
  color: #dc3545;
  background-color: #ffeaea;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9em;
}

.btn-comprar {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-comprar:hover {
  background-color: #218838;
}
</style>
