<template>
  <div class="entrades-container">
    <h2 class="titol">Les Meves Reserves Ingressades</h2>
    
    <div v-if="carregant">
      <p>Cercant referències de client...</p>
    </div>
    <!-- Establiment del missatge nociu per resposta buida -->
    <div v-else-if="entrades.length === 0" class="missatge-buit">
      <p>Actualment no disposeu de cap operació tancada ni historial de reserva.</p>
    </div>
    
    <div class="grid-entrades" v-else>
      <div v-for="entrada in entrades" :key="entrada.id" class="entrada-ticket">
        <div class="ticket-header">
           <h3>{{ entrada.sessio.pelicula.titol }}</h3>
           <span class="estat-pagament">{{ entrada.estat_pagament }}</span>
        </div>
        <div class="ticket-body">
            <p><strong>Cita al recinte:</strong> {{ entrada.sessio.data_hora }}</p>
            <p><strong>Lloc d'accés:</strong> {{ entrada.sessio.sala.nom }}</p>
            <p class="seient-info">
              Fila {{ entrada.seient.fila_seient }} - Butaca N° {{ entrada.seient.nombre_seient }}
            </p>
            <p style="text-align: right; color: #aaa; font-size: 0.8rem; margin-top: 15px;">REF. STAR-{{ entrada.id }}{{ entrada.usuari_id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../services/api';

const authStore = useAuthStore();
const entrades = ref([]);
const carregant = ref(true);

onMounted(async function() {
    if(!authStore.usuariActual) {
        carregant.value = false;
        return;
    }
    
    try {
        const dades = await api.obtenirLesMevesEntrades(authStore.usuariActual.id);
        entrades.value = dades;
    } catch (e) {
        console.error("Error al obtenir entrades:", e);
        alert("Hi ha hagut un problema carregant el teu historial d'entrades. Torna-ho a provar.");
    } finally {
        carregant.value = false;
    }
});
</script>

<style scoped>
.entrades-container {
  padding: 10px;
}
.titol {
  color: #111;
  border-bottom: 2px solid #111;
  display: inline-block;
  padding-bottom: 5px;
  margin-bottom: 30px;
}
.missatge-buit {
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  border-left: 5px solid #ffaa00;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  color: #444;
  font-size: 1.1rem;
}
.grid-entrades {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}
.entrada-ticket {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  position: relative;
  transition: transform 0.2s ease;
}
.entrada-ticket:hover {
  transform: translateY(-5px);
}
/* Recreació estètica de full lateral físic */
.entrada-ticket::before, .entrada-ticket::after {
  content: '';
  position: absolute;
  top: 55px;
  width: 20px;
  height: 20px;
  background-color: #f8f9fa;
  border-radius: 50%;
  z-index: 10;
}
.entrada-ticket::before {
  left: -10px;
  box-shadow: inset -2px 0 3px rgba(0,0,0,0.05);
}
.entrada-ticket::after {
  right: -10px;
  box-shadow: inset 2px 0 3px rgba(0,0,0,0.05);
}
.ticket-header {
  background: #111;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px dashed #666;
}
.ticket-header h3 {
  margin: 0;
  font-size: 1.1rem;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.estat-pagament {
  background: #28a745;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  font-weight: bold;
}
.ticket-body {
  padding: 30px 20px 20px 20px;
}
.ticket-body p {
  margin: 10px 0;
  color: #555;
  font-size: 0.95rem;
}
.seient-info {
  margin-top: 20px !important;
  font-size: 1.1rem !important;
  font-weight: bold;
  color: #111 !important;
  text-align: center;
  padding: 12px;
  background: #f1f3f5;
  border: 1px dashed #ccc;
  border-radius: 8px;
}
</style>
