<template>
  <div class="contenidor-principal">

    <!-- CAPÇALERA AMB NEONS -->
    <div class="contenidor-titol">
      <div class="grup-neons-wrapper esquerra">
        <div class="grup-neons-esq">
          <div class="tub-curb tub-1 rosa"></div>
          <div class="tub-curb tub-2 blau"></div>
          <div class="tub-curb tub-3 groc"></div>
          <div class="tub-curb tub-4 verd"></div>
        </div>
      </div>
      <h2 class="titol-sessions">SESSIONS</h2>
      <div class="grup-neons-wrapper dreta">
        <div class="grup-neons-dreta">
          <div class="tub-curb tub-1 rosa"></div>
          <div class="tub-curb tub-2 blau"></div>
          <div class="tub-curb tub-3 groc"></div>
          <div class="tub-curb tub-4 verd"></div>
        </div>
      </div>
    </div>

    <!-- TAULER -->
    <div class="tauler">
      <button class="boto-tornar" @click="$emit('tornar')">Tornar al catàleg</button>

      <!-- INFO PEL·LÍCULA -->
      <div class="ticket-info-neon">
        <div class="imatge-pelicula-wrapper">
          <img class="imatge-pelicula" :src="peliculaActiva.imatge_url" :alt="peliculaActiva.titol" />
        </div>
        <div class="detalls-pelicula">
          <div class="titol-info-line">
            <h2 class="titol-pelicula">{{ peliculaActiva.titol }}</h2>
            <span class="genere-bracket">({{ peliculaActiva.genere }})</span>
          </div>
          <p class="descripcio-pelicula">{{ peliculaActiva.descripcio }}</p>
          <div class="detalls-extres">
            <span class="rating-text">Any: {{ peliculaActiva.any }} | Durada: {{ peliculaActiva.durada }}</span>
            <div class="rating-box">
              <span class="stars">{{ calcularEstrelles(peliculaActiva.rating) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PAS 1: ELECCIÓ DE TIPUS -->
      <div v-if="pasActual === 1" class="fila-sessions animate-fade-in">
        <div v-if="sessionsNormals.length > 0" 
          class="cartell cartell-cian targeta-tipus" 
          @click="seleccionarTipus('normal')"
        >
          <p class="tipus-titol">SESSIÓ REGULAR</p>
          <div class="icona-sala">
            <img src="/imgclient/icon-sessionsRegulars.png" alt="Sessió Regular" />
          </div>
          <p class="hint-clic">Explorar horaris</p>
        </div>

        <div v-if="sessionsVip.length > 0" 
          class="cartell cartell-rosa targeta-tipus" 
          @click="seleccionarTipus('vip')"
        >
          <p class="tipus-titol">SESSIÓ VIP</p>
          <div class="icona-sala">
            <img src="/imgclient/icona-VIP.png" alt="Sessió VIP" />
          </div>
          <p class="hint-clic">Explorar horaris</p>
        </div>
      </div>

      <!-- PAS 2: LLISTAT DE SESSIONS I CONFIRMACIÓ -->
      <div v-else class="seccio-llistat animate-fade-in">
        <div class="capcalera-pas-2">
           <button class="boto-retro-petit" @click="pasActual = 1">← TORNAR</button>
           <h3 class="subtitol-pas">SELECCIONA L'HORARI ({{ tipusSeleccionat.toUpperCase() }})</h3>
        </div>

        <div class="contenidor-graella">
          <LlistaSessions 
            v-model="sessioTriadaId"
            :sessions="tipusSeleccionat === 'normal' ? sessionsNormals : sessionsVip" 
            :tipus="tipusSeleccionat"
            :useGrid="true"
          />
        </div>

        <div class="fila-accions-final">
           <button 
             class="boto-continuar" 
             :disabled="!sessioTriadaId"
             @click="$emit('seleccioSessio', sessioTriadaId)"
           >
             CONTINUAR A SEIENTS →
           </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCinemaStore } from '../../../stores/cinemaStore';
import LlistaSessions from '../sessions/LlistaSessions.vue';

const cinemaStore = useCinemaStore();
const pasActual = ref(1); // 1: Tipus, 2: Llista
const tipusSeleccionat = ref(null);
const sessioTriadaId = ref(null);

defineProps({
  peliculaActiva: Object
});

defineEmits(['tornar', 'seleccioSessio']);

const seleccionarTipus = (tipus) => {
  tipusSeleccionat.value = tipus;
  sessioTriadaId.value = null; // Reset per si ja n'havia triat una altre
  pasActual.value = 2;
};

// Separem les sessions normals per ensenyar-les primer
const sessionsNormals = computed(() => {
  const totes = cinemaStore.sessions;
  if (!totes) return [];
  
  const resultat = [];
  for (let i = 0; i < totes.length; i++) {
    const s = totes[i];
    // Mirem si la sala no és de les VIP
    if (s.sala && s.sala.nom.toUpperCase().indexOf('VIP') === -1) {
      resultat.push(s);
    }
  }
  return resultat;
});

// Aquí només deixem les sessions que es fan a sales VIP
const sessionsVip = computed(() => {
  const totes = cinemaStore.sessions;
  if (!totes) return [];
  
  const resultat = [];
  for (let i = 0; i < totes.length; i++) {
    const s = totes[i];
    // Busquem la paraula VIP al nom de la sala
    if (s.sala && s.sala.nom.toUpperCase().indexOf('VIP') !== -1) {
      resultat.push(s);
    }
  }
  return resultat;
});

// Posa les estrelles segons la nota que té la peli
const calcularEstrelles = (ratingStr) => {
  if (!ratingStr) return "⭐⭐";
  let valor = parseFloat(ratingStr);
  if (ratingStr && ratingStr.indexOf('%') !== -1) {
    valor = valor / 10;
  }
  const numEstrelles = Math.round(valor / 2);
  
  let estrelles = "";
  for (let i = 0; i < 5; i++) {
    if (i < numEstrelles) {
      estrelles += "⭐";
    }
  }
  return estrelles || "⭐";
};
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
  font-family: "ContentFontLight";
  src: url("/fonts/death-craft.regular.ttf");
}

.contenidor-principal {
  padding: 20px 0 60px 0;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -100px;
}

/* --- BOTÓ TORNAR --- */
.boto-tornar {
  background-color: transparent;
  color: #00eeff;
  border: 2px solid #00eeff;
  padding: 8px 20px;
  border-radius: 30px;
  font-family: "NormalFont";
  font-size: 1.1rem;
  letter-spacing: 1.5px;
  cursor: pointer;
  box-shadow: 0 0 8px #00eeff, inset 0 0 8px rgba(0, 238, 255, 0.2);
  transition: all 0.3s ease;
  margin-bottom: 20px;
  display: inline-block;
  position: relative;
  z-index: 20;
}

.boto-tornar:hover {
  background-color: #00eeff;
  color: #08080c;
}

/* --- CAPÇALERA NEON (igual que Cartellera) --- */
.contenidor-titol {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
}

.titol-sessions {
  color: #fffffff6;
  font-family: "VintageFont";
  font-size: 6rem;
  letter-spacing: 4px;
  margin-bottom: 130px;
  text-shadow:
    0 0 5px #fff45f00,
    0 0 15px #fff45f,
    0 0 30px #ffeb79,
    0 0 50px #ffe9a2;
  text-transform: uppercase;
  white-space: nowrap;
  position: relative;
  z-index: 2;
}

.grup-neons-wrapper {
  position: relative;
  width: 0;
  height: 0;
}

.grup-neons-esq,
.grup-neons-dreta {
  position: absolute;
  z-index: -1;
}

.grup-neons-esq {
  right: -10px;
}

.grup-neons-dreta {
  left: -10px;
}

.tub-curb {
  position: absolute;
  border-top: 4px solid;
  height: 400px;
  border-bottom: none;
  opacity: 0.95;
  mix-blend-mode: screen;
}

/* ESQUERRA */
.grup-neons-esq .tub-curb {
  right: 0;
  border-left: 4px solid;
  border-right: none;
}

.grup-neons-esq .tub-1 {
  width: 270px;
  top: -30px;
  border-radius: 40px 0 0 0;
}

.grup-neons-esq .tub-2 {
  width: 260px;
  top: -20px;
  border-radius: 30px 0 0 0;
}

.grup-neons-esq .tub-3 {
  width: 250px;
  top: -10px;
  border-radius: 20px 0 0 0;
}

.grup-neons-esq .tub-4 {
  width: 240px;
  top: 0px;
  border-radius: 13px 0 0 0;
}

/* DRETA */
.grup-neons-dreta .tub-curb {
  left: 0;
  border-right: 4px solid;
  border-left: none;
}

.grup-neons-dreta .tub-1 {
  width: 270px;
  top: -30px;
  border-radius: 0 40px 0 0;
}

.grup-neons-dreta .tub-2 {
  width: 260px;
  top: -20px;
  border-radius: 0 30px 0 0;
}

.grup-neons-dreta .tub-3 {
  width: 250px;
  top: -10px;
  border-radius: 0 20px 0 0;
}

.grup-neons-dreta .tub-4 {
  width: 240px;
  top: 0px;
  border-radius: 0 13px 0 0;
}

.tub-curb.rosa {
  border-color: #ff66cc;
  filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 8px #ff00aa) drop-shadow(0 0 20px #ff00aa);
}

.tub-curb.blau {
  border-color: #66ffff;
  filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 8px #00f3ff) drop-shadow(0 0 20px #00f3ff);
}

.tub-curb.groc {
  border-color: #ffff66;
  filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 8px #ffea00) drop-shadow(0 0 20px #ffea00);
}

.tub-curb.verd {
  border-color: #66ff66;
  filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 8px #00ff00) drop-shadow(0 0 20px #00ff00);
}

/* --- TAULER (igual que Cartellera) --- */
.tauler {
  background: rgb(29, 28, 26);
  border: 15px groove;
  border-image: url("/imgclient/textura2.jpg") 30 stretch;
  box-shadow:
    inset 0 8px 20px rgba(26, 23, 21, 0.856),
    0 20px 25px 10px rgb(0, 0, 0);
  padding: 40px;
  position: relative;
  z-index: 10;
  margin-top: -80px;
}

.tauler::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

/* --- LAYOUT INTERIOR TAULER --- */
.fila-sessions {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: center;
  margin-top: 30px;
}

/* --- CARTELL NEON BASE --- */
.cartell {
  background: rgba(5, 5, 18, 0.92);
  border-radius: 14px;
  padding: 24px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Doble vora: vora exterior + línia interior via outline */
.cartell::after {
  content: "";
  position: absolute;
  inset: 5px;
  border-radius: 10px;
  border: 1px solid;
  pointer-events: none;
  opacity: 0.35;
}

/* --- COLORS DE CARTELL --- */
.cartell-cian {
  border: 3px solid #00f3ff;
  box-shadow:
    0 0 10px #00f3ff,
    0 0 30px rgba(0, 243, 255, 0.4),
    inset 0 0 20px rgba(0, 243, 255, 0.08);
}

.cartell-cian::after {
  border-color: #00f3ff;
}

.cartell-rosa {
  border: 3px solid #ff00aa;
  box-shadow:
    0 0 10px #ff00aa,
    0 0 30px rgba(255, 0, 170, 0.4),
    inset 0 0 20px rgba(255, 0, 170, 0.08);
}

.cartell-rosa::after {
  border-color: #ff00aa;
}

.cartell-groc {
  border: 3px solid #ffea00;
  box-shadow:
    0 0 10px #ffea00,
    0 0 30px rgba(255, 234, 0, 0.4),
    inset 0 0 20px rgba(255, 234, 0, 0.08);
}

.cartell-groc::after {
  border-color: #ffea00;
}

/* --- INFO PEL·LÍCULA (ESTIL TICKET NEON) --- */
.ticket-info-neon {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  margin-bottom: 40px;
  background: rgba(8, 8, 12, 0.95);
  padding: 30px;
  border-radius: 20px; /* Arrodonit per semblar ticket */
  position: relative;
  border: 4px solid #ff00aa;
  box-shadow: 
    0 0 15px #ff00aa,
    inset 0 0 15px rgba(255, 0, 170, 0.5);
}

/* El marc cian interior */
.ticket-info-neon::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 3px solid #00f3ff;
  border-radius: 10px;
  pointer-events: none;
  box-shadow: 0 0 10px #00f3ff, inset 0 0 10px rgba(0, 243, 255, 0.3);
}

.imatge-pelicula-wrapper {
  flex-shrink: 0;
  border: 4px solid #fff;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  z-index: 1;
}

.imatge-pelicula {
  width: 180px;
  height: 260px;
  object-fit: cover;
  display: block;
}

.detalls-pelicula {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1;
}

.titol-info-line {
  display: flex;
  align-items: baseline;
  gap: 15px;
  flex-wrap: wrap;
}

.titol-pelicula {
  color: #00f2ff00;
  text-shadow: 0 0 10px rgb(0, 243, 255);
  font-size: 2.8rem;
  margin: 0;
  text-transform: uppercase;
  font-family: "MovingFont";
  -webkit-text-stroke: 2px rgb(0, 243, 255);
  letter-spacing: 3px;
}

.genere-bracket {
  color: #ffea00;
  font-family: "MovingFont";
  font-weight: 2;
  font-size: 1.2rem;
  letter-spacing: 2.5px;
}

.descripcio-pelicula {
  color: #eee;
  font-size: 1.5rem;
  margin: 5px 0;
  font-family: "ContentFontLight";
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 2;
}

.detalls-extres {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  padding-top: 10px;
}

.rating-text {
  color: #ffea00;
  font-family: "NormalFont";
  font-size: 1rem;
  letter-spacing: 1px;
}

.stars {
  color: #ffea00;
  font-size: 1.4rem;
  text-shadow: 0 0 8px #ffea00;
}

.rated-badge {
  background: #ffea00;
  color: #000;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-family: "NormalFont";
  font-size: 0.9rem;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* rating-val removed */

/* --- INDICADOR PAS --- */
.indicador-pas {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
  text-align: center;
}

.text-pas {
  font-family: "NormalFont";
  color: #ffea00;
  text-shadow: 0 0 10px #ffea00;
  font-size: 1.3rem;
  letter-spacing: 3px;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.text-accio {
  font-family: "VintageFont";
  color: #ffea00;
  text-shadow: 0 0 12px #ffea00, 0 0 30px rgba(255, 234, 0, 0.5);
  font-size: 2.4rem;
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

/* --- PAS 2: LLISTAT --- */
.seccio-llistat {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.capcalera-pas-2 {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
}

.subtitol-pas {
  font-family: "NormalFont";
  color: #ffea00;
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 234, 0, 0.3);
}

.boto-retro-petit {
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 5px 12px;
  cursor: pointer;
  font-family: "NormalFont";
  font-size: 0.8rem;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.boto-retro-petit:hover {
  background: #fff;
  color: #000;
}

.contenidor-graella {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 12px;
  border: 1px inset rgba(255, 255, 255, 0.05);
}

.fila-accions-final {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.boto-continuar {
  background-color: transparent;
  color: #ffea00;
  border: 3px solid #ffea00;
  padding: 15px 40px;
  border-radius: 50px;
  font-family: "VintageFont";
  font-size: 2.2rem;
  letter-spacing: 3px;
  cursor: pointer;
  box-shadow: 
    0 0 15px #ffea00,
    inset 0 0 10px rgba(255, 234, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
}

.boto-continuar:not(:disabled):hover {
  transform: scale(1.05);
  background: #ffea00;
  color: #000;
  box-shadow: 0 0 30px #ffea00;
}

.boto-continuar:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(1);
  box-shadow: none;
}

/* ANIMACIONS */
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- TARGETES TIPUS SESSIÓ --- */
.targeta-tipus {
  flex: 0 0 auto;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.targeta-tipus:hover {
  transform: translateY(-4px);
}

.cartell-cian.targeta-tipus.actiu {
  box-shadow:
    0 0 20px #00f3ff,
    0 0 50px rgba(0, 243, 255, 0.5),
    inset 0 0 30px rgba(0, 243, 255, 0.15);
  transform: translateY(-4px);
}

.cartell-rosa.targeta-tipus.actiu {
  box-shadow:
    0 0 20px #ff00aa,
    0 0 50px rgba(255, 0, 170, 0.5),
    inset 0 0 30px rgba(255, 0, 170, 0.15);
  transform: translateY(-4px);
}

.tipus-titol {
  font-family: "VintageFont";
  font-size: 2rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cartell-cian .tipus-titol {
  color: #00f2ff00;
  -webkit-text-stroke: 2px #00f3ff;
  text-shadow: 0 0 12px #00f3ff;
}

.cartell-rosa .tipus-titol {
  color: #ff00aa00;
  -webkit-text-stroke: 2px #ff00aa;
  text-shadow: 0 0 12px #ff00aa;
}

.icona-sala {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.icona-sala img {
  width: 400px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.hint-clic {
  font-family: "NormalFont";
  font-size: 0.9rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  text-align: center;
}
</style>
