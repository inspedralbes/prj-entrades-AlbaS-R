<template>
  <div class="contenidor-principal">
    <!-- CAPÇALERA -->
    <div class="contenidor-titol">
      <h2 class="titol-seients">SEIENTS</h2>
    </div>

    <!-- TAULER -->
    <div class="tauler">
      <div class="capcalera-seients">
        <button class="boto-tornar" @click="$emit('tornar')">
          ← Canviar horari
        </button>
        <div class="info-sala">
          <span class="nom-sala">{{
            cinemaStore.sessioActiva?.sala?.nom
          }}</span>
          <span class="desc-sala">Capacitat: {{ seientsTotals }} butaques</span>
        </div>
      </div>

      <!-- MAPA DE SEIENTS -->
      <div class="mapa-wrapper">
        <!-- PANTALLA -->
        <div class="pantalla-cinema">
          <div class="glow-pantalla"></div>
          <span class="text-pantalla">PANTALLA</span>
        </div>

        <!-- QUADRÍCULA -->
        <div class="quadricula-seients">
          <div
            v-for="(fila, indexFila) in seientsPerFila"
            :key="indexFila"
            class="fila-seients"
          >
            <div class="etiqueta-fila">{{ indexFila }}</div>
            <div class="butaques-fila">
              <div
                v-for="seient in fila"
                :key="seient.id"
                class="butaca-box"
                :class="{
                  ocupat: seient.ocupat,
                  seleccionat: esSeientSeleccionat(seient.id),
                  'bloquejat-altre': esSeientBloquejat(seient.id),
                }"
                @click="toggleSeient(seient)"
              >
                <div class="butaca-icon"></div>
                <span class="num-butaca">{{ seient.nombre_seient }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- LLEGENDA -->
        <div class="llegenda-seients">
          <div class="item-llegenda">
            <div class="butaca-box mini"></div>
            <span>Lliure</span>
          </div>
          <div class="item-llegenda">
            <div class="butaca-box mini ocupat"></div>
            <span>Ocupat</span>
          </div>
          <div class="item-llegenda">
            <div class="butaca-box mini seleccionat"></div>
            <span>El teu lloc</span>
          </div>
        </div>
      </div>

      <!-- BARRA DE COMPRA (CHECKOUT) -->
      <div
        class="checkout-bar"
        :class="{ visible: seientsSeleccionats.length > 0 }"
      >
        <div class="detalls-compra">
          <div class="info-tiquets">
            <span class="titol-checkout">Entrades triades:</span>
            <div class="tags-seients">
              <span
                v-for="s in seientsSeleccionats"
                :key="s.id"
                class="tag-seient"
              >
                F{{ s.fila_seient }}-S{{ s.nombre_seient }}
              </span>
            </div>
          </div>
          <div class="preu-final">
            <span class="total-label">TOTAL:</span>
            <span class="total-valor">{{ preuTotal }} €</span>
          </div>
        </div>
        <button class="boto-confirmar-reserva" @click="confirmarReserva">
          RESERVAR {{ seientsSeleccionats.length }} ENTRADES
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useCinemaStore } from "../../../stores/cinemaStore";
import { socketService } from "../../../services/socket";

const cinemaStore = useCinemaStore();
const seientsSeleccionats = ref([]);
const seientsBloquejats = ref([]);

onMounted(() => {
  socketService.entrarASessio(cinemaStore.sessioActiva.id);

  // Cuando alguien selecciona un asiento
  socketService.socket.on("seient_ocupat", (data) => {
    seientsBloquejats.value.push(data.seient_id);
  });

  // Cuando alguien desmarca su asiento
  socketService.socket.on("seient_desocupat", (data) => {
    let novaLlista = [];
    const bloquejats = seientsBloquejats.value;

    // Filtramos usando un FOR
    for (let i = 0; i < bloquejats.length; i++) {
      if (bloquejats[i] !== data.seient_id) {
        novaLlista.push(bloquejats[i]);
      }
    }
    seientsBloquejats.value = novaLlista;
  });

  // Cuando otra persona sí finaliza la compra
  socketService.socket.on("compra_finalitzada", (data) => {
    const seientsComprats = data.seient_ids;

    for (let i = 0; i < seientsComprats.length; i++) {
      let id_comprat = seientsComprats[i];

      // 1. Lo marcamos permanentemente como ocupado buscando con un FOR
      for (let j = 0; j < cinemaStore.seients.length; j++) {
        if (cinemaStore.seients[j].id === id_comprat) {
          cinemaStore.seients[j].ocupat = true;
          break; // Hemos encontrado el asiento, dejamos de buscar
        }
      }

      // 2. Lo quitamos de tu propia lista de bloqueados temporalmente con otro FOR
      let novaLlistaBloquejats = [];
      const bloquejatsAct = seientsBloquejats.value;
      for (let k = 0; k < bloquejatsAct.length; k++) {
        if (bloquejatsAct[k] !== id_comprat) {
          novaLlistaBloquejats.push(bloquejatsAct[k]);
        }
      }
      seientsBloquejats.value = novaLlistaBloquejats;
    }
  });
});

// Desconectamos el socket cuando el usuario tira para atrás
onUnmounted(() => {
  socketService.desconnectar();
});

const emit = defineEmits(["tornar", "comprar"]);

// Ajuntem els seients per cada fila per poder-los dibuixar bé
const seientsPerFila = computed(() => {
  if (!cinemaStore.seients) return {};

  const grups = {};
  const llistaSeients = cinemaStore.seients;

  // Anem omplint la graella fila per fila
  for (let i = 0; i < llistaSeients.length; i++) {
    const s = llistaSeients[i];
    if (!grups[s.fila_seient]) {
      grups[s.fila_seient] = [];
    }
    grups[s.fila_seient].push(s);
  }

  // Ordenem que les butaques vagin en ordre dins de la fila
  const files = Object.keys(grups);
  for (let j = 0; j < files.length; j++) {
    const clau = files[j];
    const fila = grups[clau];
    fila.sort((a, b) => a.nombre_seient - b.nombre_seient);
  }

  return grups;
});

const seientsTotals = computed(() => {
  if (!cinemaStore.seients) return 0;
  return cinemaStore.seients.length;
});

const preuTotal = computed(() => {
  const preuPerCap = cinemaStore.sessioActiva?.preu || 0;
  const quantitat = seientsSeleccionats.value.length;
  // Fem el càlcul del preu final i ho deixem amb dos decimals
  return (quantitat * preuPerCap).toFixed(2);
});

// Comprovem si una butaca ja l'has clicat (per pintar-la de groc)
const esSeientSeleccionat = (seientId) => {
  const llistaSeleccionats = seientsSeleccionats.value;
  for (let i = 0; i < llistaSeleccionats.length; i++) {
    if (llistaSeleccionats[i].id === seientId) {
      return true;
    }
  }
  return false;
};

const esSeientBloquejat = (seientId) => {
  const bloquejats = seientsBloquejats.value;
  for (let i = 0; i < bloquejats.length; i++) {
    if (bloquejats[i] === seientId) {
      return true;
    }
  }
  return false;
};

// Clica una butaca per agafar-la o deixar-la anar
// Clica una butaca per agafar-la o deixar-la anar
const toggleSeient = (seient) => {
  // Verificamos si esta ocupado o bloqueado por otra persona
  if (seient.ocupat === true || esSeientBloquejat(seient.id) === true) {
    return;
  }

  const llistaSeleccionats = seientsSeleccionats.value;
  let index = -1;

  // Busquem si ja la teníem a l'array per veure si l'hem de treure
  for (let i = 0; i < llistaSeleccionats.length; i++) {
    if (llistaSeleccionats[i].id === seient.id) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    // Si ja hi era, la traiem de la llista
    seientsSeleccionats.value.splice(index, 1);

    // AVISAMOS AL SOCKET DE QUE LO HEMOS SOLTADO
    socketService.desmarcarSeient(cinemaStore.sessioActiva.id, seient.id);
  } else {
    // Si no, l'afegim a la compra
    seientsSeleccionats.value.push(seient);

    // AVISAMOS AL SOCKET DE QUE LO HEMOS COGIDO
    socketService.marcarSeient(cinemaStore.sessioActiva.id, seient.id);
  }
};

// Avisem al component pare que ja volem anar a pagar
const confirmarReserva = () => {
  if (seientsSeleccionats.value.length > 0) {
    // 1. Extraemos solo los IDs con un bucle clásico
    let idsComprats = [];
    for (let i = 0; i < seientsSeleccionats.value.length; i++) {
      idsComprats.push(seientsSeleccionats.value[i].id);
    }

    // 2. Avisamos al servidor (WebSocket)
    socketService.confirmarCompra(cinemaStore.sessioActiva.id, idsComprats);

    // 3. Seguimos con el flujo normal de Vue
    emit("comprar", seientsSeleccionats.value);
  }
};

// Posa les estrelles segons el rating de la peli
const calcularEstrelles = (ratingStr) => {
  if (!ratingStr) return "⭐⭐";
  let valor = parseFloat(ratingStr);
  if (ratingStr && ratingStr.indexOf("%") !== -1) {
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

.contenidor-principal {
  padding: 20px 0 100px 0;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -100px;
}

.titol-seients {
  color: #fff45f;
  font-family: "VintageFont";
  font-size: 6rem;
  letter-spacing: 4px;
  margin-bottom: 120px;
  text-shadow:
    0 0 15px #fff45f,
    0 0 30px #ffeb79;
  text-align: center;
  text-transform: uppercase;
}

.tauler {
  background: rgb(29, 28, 26);
  border: 15px groove;
  border-image: url("/imgclient/textura2.jpg") 30 stretch;
  box-shadow:
    inset 0 8px 20px rgba(0, 0, 0, 0.8),
    0 20px 25px 10px rgb(0, 0, 0);
  padding: 40px;
  position: relative;
  z-index: 10;
  margin-top: -80px;
}

.capcalera-seients {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  padding-bottom: 20px;
}

.boto-tornar {
  background: transparent;
  color: #00eeff;
  border: 2px solid #00eeff;
  padding: 8px 20px;
  border-radius: 30px;
  font-family: "NormalFont";
  cursor: pointer;
  box-shadow: 0 0 8px #00eeff;
  transition: all 0.3s;
}

.boto-tornar:hover {
  background: #00eeff;
  color: #000;
}

.info-sala {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.nom-sala {
  color: #ff00aa;
  font-family: "VintageFont";
  font-size: 2rem;
  text-shadow: 0 0 10px #ff00aa;
}

.desc-sala {
  color: #aaa;
  font-family: "NormalFont";
  font-size: 0.9rem;
}

/* MAPA */
.mapa-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 20px;
}

.pantalla-cinema {
  width: 80%;
  height: 10px;
  background: #00f3ff;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 15px 40px rgba(0, 243, 255, 0.8);
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}

.text-pantalla {
  position: absolute;
  top: 20px;
  font-family: "NormalFont";
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 15px;
  font-size: 0.8rem;
}

.quadricula-seients {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.fila-seients {
  display: flex;
  align-items: center;
  gap: 20px;
}

.etiqueta-fila {
  width: 30px;
  color: #555;
  font-family: "NormalFont";
  font-weight: bold;
}

.butaques-fila {
  display: flex;
  gap: 10px;
}

.butaca-box {
  width: 40px;
  height: 40px;
  border: 2px solid #00f3ff;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: rgba(0, 243, 255, 0.05);
  box-shadow: 0 0 5px rgba(0, 243, 255, 0.2);
}

.butaca-box:hover:not(.ocupat) {
  transform: scale(1.1);
  box-shadow: 0 0 15px #00f3ff;
}

.butaca-box.ocupat {
  border-color: #555;
  background: #222;
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

.butaca-box.seleccionat {
  border-color: #ffea00;
  background: rgba(255, 234, 0, 0.2);
  box-shadow: 0 0 15px #ffea00;
  animation: pulse 1.5s infinite;
}

.butaca-box.bloquejat-altre {
  border-color: #ff00aa;
  background: rgba(255, 0, 170, 0.1);
  box-shadow: 0 0 10px rgba(255, 0, 170, 0.3);
  cursor: not-allowed;
  opacity: 0.7;
}

.num-butaca {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: "NormalFont";
  pointer-events: none;
}

.seleccionat .num-butaca {
  color: #fff;
  font-weight: bold;
}

/* LLEGENDA */
.llegenda-seients {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 15px 30px;
  border-radius: 30px;
}

.item-llegenda {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #eee;
  font-family: "NormalFont";
  font-size: 0.9rem;
}

.butaca-box.mini {
  width: 20px;
  height: 20px;
  border-width: 1px;
}

/* CHECKOUT BAR */
.checkout-bar {
  position: sticky;
  bottom: 0px;
  background: rgba(8, 8, 12, 0.98);
  border: 3px solid #ffea00;
  border-radius: 20px;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  box-shadow:
    0 -10px 40px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 234, 0, 0.2);
  transform: translateY(150%);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
}

.checkout-bar.visible {
  transform: translateY(0);
}

.detalls-compra {
  display: flex;
  gap: 40px;
  align-items: center;
}

.info-tiquets {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.titol-checkout {
  color: #aaa;
  font-family: "NormalFont";
  font-size: 0.8rem;
}

.tags-seients {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-seient {
  background: #ffea00;
  color: #000;
  padding: 2px 10px;
  border-radius: 5px;
  font-weight: bold;
  font-family: "NormalFont";
  font-size: 0.9rem;
}

.preu-final {
  display: flex;
  flex-direction: column;
}

.total-label {
  color: #aaa;
  font-family: "NormalFont";
  font-size: 0.8rem;
}

.total-valor {
  color: #ffea00;
  font-family: "VintageFont";
  font-size: 2.5rem;
  line-height: 1;
  text-shadow: 0 0 10px #ffea00;
}

.boto-confirmar-reserva {
  background: #ffea00;
  color: #000;
  border: none;
  padding: 15px 30px;
  border-radius: 40px;
  font-family: "VintageFont";
  font-size: 1.8rem;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 0 15px #ffea00;
  transition: all 0.3s;
}

.boto-confirmar-reserva:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px #ffea00;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px #ffea00;
  }
  50% {
    box-shadow: 0 0 25px #ffea00;
  }
  100% {
    box-shadow: 0 0 5px #ffea00;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
