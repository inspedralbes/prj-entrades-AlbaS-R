<template>
  <div class="entrades-pagina">
    <div class="header-retro">
      <h2 class="titol-neon">Les Meves <span class="highlight">Reserves</span></h2>
      <div class="neon-line"></div>
    </div>
    
    <div v-if="carregant" class="loading-container">
      <div class="scanner-bar"></div>
      <p class="loading-text">Cercant referències de client...</p>
    </div>

    <!-- Establiment del missatge nociu per resposta buida -->
    <div v-else-if="entrades.length === 0" class="missatge-buit">
      <div class="sign-vintage">
        <h3>TAQUILLA TANCADA</h3>
        <p>Actualment no disposeu de cap operació tancada ni historial de reserva.</p>
        <NuxtLink to="/usuario" class="btn-tornar">Anar a Cartellera</NuxtLink>
      </div>
    </div>
    
    <div class="grid-entrades" v-else>
      <div v-for="entrada in entrades" :key="entrada.id" class="entrada-ticket">
        <!-- Punch holes -->
        <div class="punch-hole left"></div>
        <div class="punch-hole right"></div>
        
        <div class="ticket-header">
           <div class="movie-info">
             <span class="label-ticket">PEL·LÍCULA</span>
             <h3>{{ entrada.sessio.pelicula.titol }}</h3>
           </div>
           <div class="payment-badge" :class="entrada.estat_pagament.toLowerCase()">
             {{ entrada.estat_pagament }}
           </div>
        </div>

        <div class="perforation">
          <div class="dots"></div>
        </div>

        <div class="ticket-body">
            <div class="body-row">
              <div class="body-col">
                <span class="label-ticket">SALA</span>
                <p class="val-ticket highlight-cyan">{{ entrada.sessio.sala.nom }}</p>
              </div>
              <div class="body-col">
                <span class="label-ticket">DATA I HORA</span>
                <p class="val-ticket">{{ formatData(entrada.sessio.data_hora) }}</p>
              </div>
            </div>

            <div class="seient-strip">
              <div class="seient-info">
                <span class="label-mini">FILA</span>
                <span class="num-grand">{{ entrada.seient.fila_seient }}</span>
              </div>
              <div class="seient-separator"></div>
              <div class="seient-info">
                <span class="label-mini">BUTACA</span>
                <span class="num-grand">{{ entrada.seient.nombre_seient }}</span>
              </div>
            </div>

            <div class="ticket-footer">
              <div class="barcode">
                || | ||| || || | || ||| | ||
              </div>
              <p class="ref-code">REF. STAR-{{ entrada.id }}{{ entrada.usuari_id }}</p>
            </div>
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

function formatData(dataStr) {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    return d.toLocaleDateString('ca-ES', { 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
    }).replace(',', ' a les');
}

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
    } finally {
        carregant.value = false;
    }
});
</script>

  <style scoped>
    @font-face {
      font-family: "VintageFont";
      src: url("/fonts/neon_light/NeonLight-Regular.ttf") format("truetype");
    }

    @font-face {
      font-family: "NormalFont";
      src: url("/fonts/tt-directors-demo.bl-regular.ttf") format("truetype");
    }

    @font-face {
      font-family: "MovingFont";
      src: url("/fonts/moving.regular.otf") format("truetype");
    }

    @font-face {
      font-family: "ContentForm";
      src: url("/fonts/black-writing.regular.ttf") format("truetype");
    }

    .entrades-pagina {
      background: rgb(29, 28, 26);
      border: 15px groove;
      border-image: url("/imgclient/textura2.jpg") 30 stretch;
      box-shadow:
        inset 0 8px 20px rgba(26, 23, 21, 0.856),
        0 20px 25px 10px rgb(0, 0, 0);
      min-height: 100vh;
      padding: 60px 40px;
      color: #fff;
      font-family: "ContentForm";
      position: relative;
      z-index: 10;
      max-width: 1200px;
      margin: 0 auto;
    }

    .entrades-pagina::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
      pointer-events: none;
    }

    .header-retro {
      text-align: center;
      margin-bottom: 50px;
      position: relative;
      z-index: 2;
    }

    .titol-neon {
      font-family: "VintageFont";
      font-size: 3.5rem;
      color: #ff00aa;
      text-shadow: 0 0 10px #ff00aa, 0 0 20px #ff00aa;
      margin-bottom: 10px;
      letter-spacing: 3px;
    }

    .highlight {
      color: #00f3ff;
      text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;
    }

    .neon-line {
      height: 2px;
      background: #ffea00;
      width: 200px;
      margin: 0 auto;
      box-shadow: 0 0 10px #ffea00;
    }

    /* Loading state */
    .loading-container {
      text-align: center;
      padding: 50px;
    }

    .loading-text {
      color: #ffea00;
      font-family: "NormalFont";
      font-size: 1.5rem;
      text-shadow: 0 0 5px #ffea00;
    }

    .scanner-bar {
      width: 100px;
      height: 4px;
      background: #00f3ff;
      margin: 20px auto;
      box-shadow: 0 0 15px #00f3ff;
      animation: scan 1.5s infinite alternate;
    }

    @keyframes scan {
      from {
        transform: translateX(-50px);
      }

      to {
        transform: translateX(50px);
      }
    }

    /* Empty State */
    .missatge-buit {
      display: flex;
      justify-content: center;
    }

    .sign-vintage {
      background: #111;
      border: 4px solid #ffea00;
      padding: 40px;
      text-align: center;
      border-radius: 4px;
      box-shadow: 0 0 20px rgba(255, 234, 0, 0.3);
      max-width: 500px;
    }

    .sign-vintage h3 {
      font-family: "MovingFont";
      color: #ff00aa;
      font-size: 2.2rem;
      margin-bottom: 15px;
    }

    .btn-tornar {
      display: inline-block;
      margin-top: 25px;
      padding: 10px 25px;
      border: 2px solid #00f3ff;
      color: #00f3ff;
      text-decoration: none;
      font-family: "NormalFont";
      border-radius: 20px;
      transition: 0.3s;
    }

    .btn-tornar:hover {
      background: #00f3ff;
      color: #08080c;
      box-shadow: 0 0 15px #00f3ff;
    }

    /* Grid layout */
    .grid-entrades {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 40px;
      position: relative;
      z-index: 1;
    }

    /* Ticket Stub Design */
    .entrada-ticket {
      background: #f8f1e5;
      /* Vintage paper color */
      color: #222;
      border-radius: 8px;
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .entrada-ticket:hover {
      transform: translateY(-8px) rotate(1deg);
    }

    .punch-hole {
      position: absolute;
      top: 80px;
      width: 24px;
      height: 24px;
      background: rgb(29, 28, 26);
      /* Matches tauler background */
      border-radius: 50%;
      z-index: 5;
    }

    .punch-hole.left {
      left: -12px;
      box-shadow: inset -4px 0 5px rgba(0, 0, 0, 0.2);
    }

    .punch-hole.right {
      right: -12px;
      box-shadow: inset 4px 0 5px rgba(0, 0, 0, 0.2);
    }

    .ticket-header {
      padding: 25px;
      background: #1a1a1a;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .label-ticket {
      display: block;
      font-family: "NormalFont";
      font-size: 0.7rem;
      color: #aaa;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .movie-info h3 {
      margin: 0;
      font-family: "MovingFont";
      font-size: 1.6rem;
      color: #ffea00;
      text-shadow: 0 0 5px rgba(255, 234, 0, 0.4);
    }

    .payment-badge {
      font-family: "NormalFont";
      font-size: 0.7rem;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid currentColor;
    }

    .payment-badge.pagat {
      color: #66ff66;
      border-color: #66ff66;
    }

    .payment-badge.pendent {
      color: #ffea00;
      border-color: #ffea00;
    }

    .perforation {
      height: 2px;
      background: transparent;
      position: relative;
      margin: 0 20px;
    }

    .dots {
      border-top: 2px dashed #999;
      width: 100%;
      position: absolute;
      top: 0;
    }

    .ticket-body {
      padding: 30px 25px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .body-row {
      display: flex;
      justify-content: space-between;
    }

    .val-ticket {
      font-family: "ContentForm";
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0;
    }

    .highlight-cyan {
      color: #007788;
    }

    .seient-strip {
      background: #ddd;
      border: 2px solid #bbb;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
      gap: 20px;
    }

    .seient-info {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .label-mini {
      font-family: "NormalFont";
      font-size: 0.6rem;
      color: #666;
    }

    .num-grand {
      font-family: "MovingFont";
      font-size: 1.8rem;
      color: #111;
    }

    .seient-separator {
      width: 2px;
      height: 40px;
      background: #bbb;
    }

    .ticket-footer {
      margin-top: 10px;
      text-align: center;
      border-top: 1px solid #ccc;
      padding-top: 15px;
    }

    .barcode {
      font-family: monospace;
      font-size: 1.2rem;
      letter-spacing: -2px;
      color: #444;
      margin-bottom: 5px;
    }

    .ref-code {
      font-size: 0.7rem;
      color: #888;
      margin: 0;
    }

    @media (max-width: 600px) {
      .titol-neon {
        font-size: 2.2rem;
      }

      .grid-entrades {
        grid-template-columns: 1fr;
      }
    }
  </style>
