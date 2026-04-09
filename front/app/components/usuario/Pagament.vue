<template>
  <div class="contenidor-pagament">
    
    <div class="contenidor-titol">
      <h2 class="titol-pas">PAGAMENT</h2>
    </div>

    <div class="tauler-pagament">
      
      <!-- RESUM DE LA COMPRA -->
      <div class="columna-resum">
        <h3 class="subtitol-neó">Resum de la reserva</h3>
        <div class="detalls-resum">
          <div class="peli-info">
            <span class="etiqueta">Pel·lícula:</span>
            <span class="valor peli-titol">{{ peliculaActiva?.titol }}</span>
          </div>
          <div class="sessio-info">
            <span class="etiqueta">Sessió:</span>
            <span class="valor">{{ formatarData(cinemaStore.sessioActiva?.data_hora) }}</span>
          </div>
          <div class="seients-info">
            <span class="etiqueta">Butaques:</span>
            <div class="tags-butaques">
              <span v-for="s in seientsSeleccionats" :key="s.id" class="tag-seient">
                F{{ s.fila_seient }}-S{{ s.nombre_seient }}
              </span>
            </div>
          </div>
          <div class="divisor-neó"></div>
          <div class="total-info">
            <span class="etiqueta-total">A PAGAR:</span>
            <span class="valor-total">{{ calcularPreuTotal() }} €</span>
          </div>
        </div>
      </div>

      <!-- FORMULARI DE TARGETA -->
      <div class="columna-formulari">
        <h3 class="subtitol-neó">Dades de la targeta</h3>
        <form @submit.prevent="enviarPagament" class="formulari-targeta">
          
          <div class="grup-entrada full">
            <label>Titular de la targeta</label>
            <input 
              type="text" 
              v-model="dadesPagament.titular" 
              placeholder="NOM COMPLET" 
              required
            >
          </div>

          <div class="grup-entrada full">
            <label>Número de targeta</label>
            <input 
              type="text" 
              v-model="dadesPagament.numero" 
              placeholder="0000 0000 0000 0000" 
              maxlength="16"
              required
            >
          </div>

          <div class="fila-entrades">
            <div class="grup-entrada">
              <label>Caducitat</label>
              <input 
                type="text" 
                v-model="dadesPagament.caducitat" 
                placeholder="MM/AA" 
                maxlength="5"
                required
              >
            </div>
            <div class="grup-entrada">
              <label>CVV</label>
              <input 
                type="password" 
                v-model="dadesPagament.cvv" 
                placeholder="000" 
                maxlength="3"
                required
              >
            </div>
          </div>

          <div class="accions-pagament">
            <button type="button" class="boto-neó secundari" @click="$emit('tornar')">
              TORNAR AL MAPA
            </button>
            <button type="submit" class="boto-neó primari">
              CONFIRMAR I PAGAR
            </button>
          </div>
          
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCinemaStore } from '../../../stores/cinemaStore';

const props = defineProps({
  peliculaActiva: Object,
  seientsSeleccionats: Array
});

const emit = defineEmits(['tornar', 'pagat']);
const cinemaStore = useCinemaStore();

const dadesPagament = ref({
  titular: '',
  numero: '',
  caducitat: '',
  cvv: ''
});

// Calculem el preu total basant-nos en els seients triats
function calcularPreuTotal() {
  const preuUnitari = cinemaStore.sessioActiva?.preu || 0;
  return (props.seientsSeleccionats.length * preuUnitari).toFixed(2);
}

// Netegem la data per mostrar-la maca
function formatarData(dataHora) {
  if (!dataHora) return "";
  try {
    // Si la data ve amb una 'T' al mig (ISO), la canviem per un espai per separar-ho bé
    const formatNet = dataHora.replace('T', ' ');
    const parts = formatNet.split(' ');
    const data = parts[0].split('-').reverse().join('/');
    const hora = parts[1] ? parts[1].slice(0, 5) : '';
    return `${data} a les ${hora}`;
  } catch (e) {
    return dataHora;
  }
}

// Simulem el pagament i avisem al pare
function enviarPagament() {
  emit('pagat');
}
</script>

<style scoped>
@font-face {
  font-family: "TipografiaVintage";
  src: url("/fonts/neon_light/NeonLight-Regular.ttf") format("truetype");
}
@font-face {
  font-family: "TipografiaNormal";
  src: url("/fonts/tt-directors-demo.bl-regular.ttf") format("truetype");
}

.contenidor-pagament {
  padding: 40px 0 100px 0;
  max-width: 1100px;
  margin: 0 auto;
  margin-top: -100px;
}

.titol-pas {
  color: #fff45f;
  font-family: "TipografiaVintage";
  font-size: 5rem;
  letter-spacing: 4px;
  margin-bottom: 60px;
  text-shadow: 0 0 15px #fff45f, 0 0 30px #ffeb79;
  text-align: center;
}

.tauler-pagament {
  background: rgb(29, 28, 26);
  border: 15px groove;
  border-image: url("/imgclient/textura2.jpg") 30 stretch;
  box-shadow: inset 0 8px 20px rgba(0,0,0,0.8), 0 20px 25px 10px rgb(0,0,0);
  padding: 50px;
  display: flex;
  gap: 60px;
  position: relative;
  z-index: 10;
}

.subtitol-neó {
  color: #00eeff;
  font-family: "TipografiaVintage";
  font-size: 2.2rem;
  margin-bottom: 30px;
  text-shadow: 0 0 10px #00eeff;
}

/* COLUMNA RESUM */
.columna-resum {
  flex: 1;
  border-right: 1px dashed rgba(255, 255, 255, 0.1);
  padding-right: 40px;
}

.detalls-resum {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.etiqueta {
  display: block;
  color: #888;
  font-family: "TipografiaNormal";
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.valor {
  color: #fff;
  font-family: "TipografiaNormal";
  font-size: 1.2rem;
}

.peli-titol {
  color: #fff45f;
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tags-butaques {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 5px;
}

.tag-seient {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #00eeff;
  color: #00eeff;
  padding: 2px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
}

.divisor-neó {
  height: 1px;
  background: linear-gradient(to right, #00eeff, transparent);
  margin: 10px 0;
}

.etiqueta-total {
  color: #ff00aa;
  font-family: "TipografiaVintage";
  font-size: 1.2rem;
  display: block;
}

.valor-total {
  color: #ff00aa;
  font-family: "TipografiaVintage";
  font-size: 3.5rem;
  text-shadow: 0 0 15px #ff00aa;
}

/* COLUMNA FORMULARI */
.columna-formulari {
  flex: 1.5;
}

.formulari-targeta {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.grup-entrada {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grup-entrada.full {
  width: 100%;
}

.fila-entrades {
  display: flex;
  gap: 20px;
}

label {
  color: #aaa;
  font-family: "TipografiaNormal";
  font-size: 0.9rem;
  letter-spacing: 1px;
}

input {
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-bottom: 2px solid #555;
  padding: 12px 15px;
  color: #fff;
  font-family: "TipografiaNormal";
  font-size: 1.1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-bottom-color: #00eeff;
  box-shadow: 0 4px 10px rgba(0, 238, 255, 0.1);
  background: rgba(0, 238, 255, 0.05);
}

.accions-pagament {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.boto-neó {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 40px;
  font-family: "TipografiaVintage";
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.boto-neó.primari {
  background: #fff45f;
  color: #000;
  box-shadow: 0 0 15px #fff45f;
}

.boto-neó.primari:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px #fff45f;
}

.boto-neó.secundari {
  background: transparent;
  color: #00eeff;
  border: 2px solid #00eeff;
  font-size: 1.2rem;
}

.boto-neó.secundari:hover {
  background: rgba(0, 238, 255, 0.1);
  box-shadow: 0 0 15px #00eeff;
}

@media (max-width: 900px) {
  .tauler-pagament {
    flex-direction: column;
    padding: 30px;
  }
  .columna-resum {
    border-right: none;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
    padding-right: 0;
    padding-bottom: 30px;
  }
}
</style>
