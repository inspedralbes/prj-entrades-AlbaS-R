<template>
  <div class="contenidor-principal">
    <button @click="$emit('tornar')" class="btn-back">⬅ TORNAR A LA CARTELLERA</button>

    <div class="contenidor-titol">
      <div class="grup-neons-wrapper esquerra">
        <div class="grup-neons-esq">
          <div class="tub-curb tub-1 rosa"></div>
          <div class="tub-curb tub-2 blau"></div>
          <div class="tub-curb tub-3 groc"></div>
          <div class="tub-curb tub-4 verd"></div>
        </div>
      </div>
      <h2 class="titol-cartellera">SESSIONS</h2>
      <div class="grup-neons-wrapper dreta">
        <div class="grup-neons-dreta">
          <div class="tub-curb tub-1 rosa"></div>
          <div class="tub-curb tub-2 blau"></div>
          <div class="tub-curb tub-3 groc"></div>
          <div class="tub-curb tub-4 verd"></div>
        </div>
      </div>
    </div>

    <div class="tauler">
      <h3 class="titol-pelicula-activa">HORARIS PER A: {{ peliculaActiva?.titol }}</h3>

      <p v-if="cinemaStore.sessions.length === 0" class="missatge-buit">Sense resultats d'horaris per a aquesta
        selecció.</p>

      <ul class="sessions-llista">
        <li v-for="sessio in cinemaStore.sessions" :key="sessio.id" class="sessio-card">
          <div class="sessio-detalls">
            <p class="dades-sessio"><span class="etiqueta">HORARI:</span> {{ sessio.data_hora }} </p>
            <p class="dades-sessio"><span class="etiqueta">SALA:</span> <span class="badge-sala">{{ sessio.sala.nom }}
                ({{ sessio.sala.nom === 'Sala VIP' ? 'Luxury' : 'Bàsic' }})</span></p>
            <p class="dades-sessio"><span class="etiqueta">TARIFA:</span> <span class="preu">{{ sessio.preu }} €</span>
            </p>
          </div>
          <button class="btn-seleccionar-seients" @click="$emit('seleccioSessio', sessio.id)">TRIA LA LOCALITAT</button>
        </li>
      </ul>
    </div>
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
@font-face {
  font-family: "VintageFont";
  src: url("/fonts/neon_light/NeonLight-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.contenidor-principal {
  padding: 20px 0 60px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  background-color: transparent;
  color: #00f3ff;
  border: 2px solid #00f3ff;
  padding: 8px 18px;
  border-radius: 30px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 8px #00f3ff, inset 0 0 8px #00f3ff;
  text-shadow: 0 0 5px #00f3ff;
  transition: all 0.3s ease;
  margin-bottom: 30px;
  font-size: 0.85rem;
}

.btn-back:hover {
  background-color: #00f3ff;
  color: #08080c;
  box-shadow: 0 0 15px #00f3ff;
}

.contenidor-titol {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
}

.titol-cartellera {
  color: #fffffff6;
  font-family: "VintageFont";
  font-size: 6rem;
  letter-spacing: 4px;
  margin-bottom: 120px;
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
  width: 180px;
  top: -30px;
  border-radius: 40px 0 0 0;
}

.grup-neons-esq .tub-2 {
  width: 170px;
  top: -20px;
  border-radius: 30px 0 0 0;
}

.grup-neons-esq .tub-3 {
  width: 160px;
  top: -10px;
  border-radius: 20px 0 0 0;
}

.grup-neons-esq .tub-4 {
  width: 150px;
  top: 0px;
  border-radius: 10px 0 0 0;
}

/* DRETA */
.grup-neons-dreta .tub-curb {
  left: 0;
  border-right: 4px solid;
  border-left: none;
}

.grup-neons-dreta .tub-1 {
  width: 180px;
  top: -30px;
  border-radius: 0 40px 0 0;
}

.grup-neons-dreta .tub-2 {
  width: 170px;
  top: -20px;
  border-radius: 0 30px 0 0;
}

.grup-neons-dreta .tub-3 {
  width: 160px;
  top: -10px;
  border-radius: 0 20px 0 0;
}

.grup-neons-dreta .tub-4 {
  width: 150px;
  top: 0px;
  border-radius: 0 10px 0 0;
}

.tub-curb.rosa {
  border-color: #ff66cc;
  filter: drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 8px #ff00aa) drop-shadow(0 0 20px #ff00aa);
}

.tub-curb.blau {
  border-color: #66ffff;
  filter: drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 8px #00f3ff) drop-shadow(0 0 20px #00f3ff);
}

.tub-curb.groc {
  border-color: #ffff66;
  filter: drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 8px #ffea00) drop-shadow(0 0 20px #ffea00);
}

.tub-curb.verd {
  border-color: #66ff66;
  filter: drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 8px #00ff00) drop-shadow(0 0 20px #00ff00);
}

.tauler {
  background: #1d1c1a;
  border: 15px groove;
  border-image: url("/imgclient/textura2.jpg") 30 stretch;
  box-shadow: inset 0 8px 20px rgba(0, 0, 0, 0.8), 0 15px 30px rgba(0, 0, 0, 0.5);
  padding: 40px;
  position: relative;
  z-index: 10;
  margin-top: -70px;
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

.titol-pelicula-activa {
  color: #00f3ff;
  text-shadow: 0 0 5px #00f3ff, 0 0 15px #00f3ff;
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-transform: uppercase;
  font-family: "Trebuchet MS", Arial, sans-serif;
  text-align: center;
  letter-spacing: 2px;
}

.missatge-buit {
  padding: 30px;
  color: #ffea00;
  text-shadow: 0 0 5px #ffea00;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  border: 1px dashed #ffea00;
  border-radius: 8px;
}

.sessions-llista {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sessio-card {
  background: #08080c;
  border: 2px solid #ff00aa;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 15px rgba(255, 0, 170, 0.3), inset 0 0 10px rgba(255, 0, 170, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sessio-card:hover {
  transform: scale(1.01);
  box-shadow: 0 0 20px rgba(255, 0, 170, 0.6), inset 0 0 15px rgba(255, 0, 170, 0.2);
}

.dades-sessio {
  margin: 8px 0;
  color: #eee;
  font-size: 1.1rem;
}

.etiqueta {
  color: #00f3ff;
  font-weight: bold;
  margin-right: 10px;
  text-shadow: 0 0 2px #00f3ff;
}

.badge-sala {
  background: rgba(0, 243, 255, 0.15);
  border: 1px solid #00f3ff;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  color: #fff;
  text-shadow: 0 0 3px #00f3ff;
}

.preu {
  color: #ffea00;
  font-weight: 800;
  font-size: 1.3rem;
  text-shadow: 0 0 5px #ffea00;
}

.btn-seleccionar-seients {
  background-color: transparent;
  color: #00f3ff;
  border: 2px solid #00f3ff;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 10px #00f3ff, inset 0 0 10px #00f3ff;
  text-shadow: 0 0 5px #00f3ff;
  transition: all 0.3s ease;
}

.btn-seleccionar-seients:hover {
  background-color: #00f3ff;
  color: #08080c;
  box-shadow: 0 0 20px #00f3ff;
  text-shadow: none;
}
</style>
