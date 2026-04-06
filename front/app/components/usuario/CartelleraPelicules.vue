<template>
  <div class="contenidor-principal">
    <div class="contenidor-titol">
      <h2 class="titol-cartellera">CARTELLERA</h2>
    </div>

    <div class="tauler">
      <ul class="llista-pelicules">
        <li v-for="pelicula in cinemaStore.pelicules" :key="pelicula.id" class="targeta-pelicula">
          <img :src="pelicula.imatge_url" :alt="pelicula.titol" class="imatge-pelicula" />

          <div class="info-pelicula">
            <span class="etiqueta-pantalla">ARA A LA PANTALLA</span>
            <h3 class="titol-pelicula">{{ pelicula.titol }}</h3>
            <p class="dades-pelicula">{{ pelicula.any }} | {{ pelicula.durada }}</p>
            <p class="descripcio-pelicula">{{ pelicula.genere }}</p>
            <button class="boto-comprar" @click="$emit('seleccioPelicula', pelicula)">COMPRAR ENTRADES</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useCinemaStore } from '../../../stores/cinemaStore';
const cinemaStore = useCinemaStore();

defineEmits(['seleccioPelicula']);
</script>

<style scoped>
@font-face {
  font-family: 'VintageFont';
  src: url('/fonts/neon_light/NeonLight-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.contenidor-principal {
  padding: 20px 0 60px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.contenidor-titol {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  padding: 0 20px;
}

.titol-cartellera {
  color: #fffffff6;
  font-family: 'VintageFont';
  font-size: 6rem;
  letter-spacing: 4px;
  margin: 0;
  text-shadow: 0 0 5px #fff45f00, 0 0 15px #fff45f, 0 0 30px #ffeb79, 0 0 50px #ffe9a2;
  text-transform: uppercase;
  white-space: nowrap;
}



.tauler {
  background: #2b1d14;
  background-image: repeating-linear-gradient(to bottom,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 5px,
      rgba(0, 0, 0, 0.5) 5px,
      rgba(0, 0, 0, 0.5) 15px);
  border: 15px solid #4a2e1b;
  border-radius: 10px;
  box-shadow: inset 0 0 40px #000, 0 20px 40px rgba(0, 0, 0, 0.9);
  padding: 40px;
  position: relative;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px;
  position: relative;
  z-index: 1;
}

.targeta-pelicula {
  background: #08080c;
  border: 2px solid #00f3ff;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.4), inset 0 0 15px rgba(0, 243, 255, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.targeta-pelicula:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 243, 255, 0.8), inset 0 0 15px rgba(0, 243, 255, 0.4);
}

.imatge-pelicula {
  width: 100%;
  height: 380px;
  object-fit: cover;
  border-bottom: 2px solid rgba(0, 243, 255, 0.4);
}

.info-pelicula {
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  flex-grow: 1;
  gap: 10px;
}

.etiqueta-pantalla {
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.titol-pelicula {
  color: #00f3ff;
  text-shadow: 0 0 5px #00f3ff, 0 0 15px #00f3ff;
  font-size: 1.5rem;
  margin: 5px 0;
  text-transform: uppercase;
  font-family: 'Trebuchet MS', Arial, sans-serif;
  letter-spacing: 1px;
}

.dades-pelicula {
  color: #ffea00;
  text-shadow: 0 0 5px #ffea00;
  font-size: 0.95rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
}

.descripcio-pelicula {
  color: #aaa;
  font-size: 0.9rem;
  margin-top: 5px;
  margin-bottom: 20px;
  flex-grow: 1;
}

.boto-comprar {
  background-color: transparent;
  color: #ff00aa;
  border: 2px solid #ff00aa;
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  box-shadow: 0 0 10px #ff00aa, inset 0 0 10px #ff00aa;
  text-shadow: 0 0 5px #ff00aa;
  transition: all 0.3s ease;
  width: 100%;
}

.boto-comprar:hover {
  background-color: #ff00aa;
  color: #fff;
  box-shadow: 0 0 20px #ff00aa, inset 0 0 15px #ff00aa;
  text-shadow: none;
}
</style>
