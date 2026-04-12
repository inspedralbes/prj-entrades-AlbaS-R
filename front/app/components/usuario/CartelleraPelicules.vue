<template>
  <div class="contenidor-principal">
    <div class="contenidor-titol">
      <div class="grup-neons-wrapper esquerra">
        <div class="grup-neons-esq">
          <div class="tub-curb tub-1 rosa"></div>
          <div class="tub-curb tub-2 blau"></div>
          <div class="tub-curb tub-3 groc"></div>
          <div class="tub-curb tub-4 verd"></div>
        </div>
      </div>
      <h2 class="titol-cartellera">CARTELLER</h2>
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
      <ul class="llista-pelicules">
        <li v-for="pelicula in cinemaStore.pelicules" :key="pelicula.id" class="targeta-pelicula">
          <div class="imatge-pelicula-wrapper">
            <img :src="pelicula.imatge_url" :alt="pelicula.titol" class="imatge-pelicula" />
          </div>

          <div class="info-pelicula">
            <h3 class="titol-pelicula">{{ pelicula.titol }}</h3>
            <p class="dades-pelicula">
              {{ pelicula.any }} | {{ pelicula.durada }}
            </p>
            <p class="descripcio-pelicula">{{ pelicula.genere }}</p>
            <button class="boto-comprar" @click="$emit('seleccioPelicula', pelicula)">
              COMPRAR ENTRADES
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useCinemaStore } from "../../../stores/cinemaStore";
const cinemaStore = useCinemaStore();

defineEmits(["seleccioPelicula"]);
</script>

<style scoped>
@font-face {
  font-family: "VintageFont";
  src: url("/fonts/neon_light/NeonLight-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "NormalFont";
  src: url("/fonts/tt-directors-demo.bl-regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "MovingFont";
  src: url("/fonts/moving.regular.otf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "ContentForm";
  src: url("/fonts/black-writing.regular.ttf");
}

.contenidor-principal {
  padding: 20px 0 60px 0;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -100px;
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

.llista-pelicules {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  position: relative;
  z-index: 1;
}

.targeta-pelicula {
  background: #08080c;
  border: 2px solid #00f3ff;
  border-radius: 12px;
  box-shadow:
    0 0 15px rgba(0, 243, 255, 0.4),
    inset 0 0 15px rgba(0, 243, 255, 0.2);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 20px;
  gap: 20px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.targeta-pelicula:hover {
  transform: translateY(-5px);
  box-shadow:
    0 6px 20px rgba(0, 243, 255, 0.8),
    inset 0 0 15px rgba(0, 243, 255, 0.4);
}

.imatge-pelicula-wrapper {
  flex-shrink: 0;
  border: 2px solid #ff00aa;
  border-radius: 8px;
  padding: 6px;
  box-shadow:
    0 0 10px rgba(255, 0, 170, 0.6),
    inset 0 0 10px rgba(255, 0, 170, 0.4);
  background: #08080c;
  display: flex;
  align-items: center;
}

.imatge-pelicula {
  width: 200px;
  height: 290px;
  object-fit: cover;
  display: block;
  border: solid #ffffff;
}

.info-pelicula {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  flex-grow: 1;
  gap: 8px;
  font-family: "MovingFont";
}

.titol-pelicula {
  color: #00f2ff00;
  text-shadow:
    0 0 15px rgb(0, 243, 255);
  font-size: 2.5rem;
  margin: 0;
  text-transform: uppercase;
  font-weight: 1;
  font-family: "MovingFont";
  -webkit-text-stroke: 2px rgb(0, 243, 255);
  letter-spacing: 1px;
}

.dades-pelicula {
  color: #ffea00;
  font-family: "MovingFont";
  font-size: 1.5rem;
  font-weight: 1;
  margin: 0;
  letter-spacing: 1px;
}

.descripcio-pelicula {
  color: #aaa;
  font-size: 1.2rem;
  margin: 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: "ContentForm";
}

.boto-comprar {
  background-color: transparent;
  color: #00eeff;
  border: 2px solid #ff00aa;
  padding: 10px 24px;
  border-radius: 30px;
  font-family: "NormalFont";
  font-size: 1.5rem;
  letter-spacing: 1.9px;
  cursor: pointer;
  box-shadow:
    0 0 10px #ff00aa,
    inset 0 0 10px #ff00aa;
  transition: all 0.3s ease;
  align-self: flex-start;
  margin-top: auto;
}

.boto-comprar:hover {
  background-color: #ff00aa;
  color: #fff;
  text-shadow: none;
}
</style>
