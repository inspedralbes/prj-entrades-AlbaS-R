<template>
  <div>
    <div v-if="cinemaStore.carregant">
      <p>Carregant dades...</p>
    </div>

    <div v-else>
      <!-- Views referenciades de la carpeta components/usuario/ -->
      <UsuarioCartelleraPelicules v-if="vistaActual === 'cartellera'" @seleccioPelicula="seleccionarPelicula" />

      <UsuarioSeleccioSessio v-else-if="vistaActual === 'sessions'" :peliculaActiva="peliculaActiva"
        @tornar="vistaActual = 'cartellera'" @seleccioSessio="seleccionarSessio" />

      <UsuarioSeleccioSeients v-else-if="vistaActual === 'seients'" @tornar="vistaActual = 'sessions'"
        @comprar="iniciarPasarela" />

      <UsuarioPagament v-else-if="vistaActual === 'pagament'" :peliculaActiva="peliculaActiva"
        :seientsSeleccionats="reservaDeButacaTemporal" @tornar="vistaActual = 'seients'" @pagat="compraRealitzada" />
    </div>
    <!-- Temporitzador visual -->
    <div v-if="['seients', 'pagament'].includes(vistaActual)" class="temporitzador-container">
      <div class="temporitzador-box" :class="{ 'temps-critic': tempsRestant < 60 }">
        <span class="label">TEMPS RESTANT:</span>
        <span class="rellotge">{{ formatarTemps(tempsRestant) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useCinemaStore } from '../../../stores/cinemaStore';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../services/api';
import UsuarioPagament from '../../components/usuario/Pagament.vue';
import { socketService } from '../../../services/socket';

const cinemaStore = useCinemaStore();
const authStore = useAuthStore();

const vistaActual = ref('cartellera');
const peliculaActiva = ref(null);
const reservaDeButacaTemporal = ref([]);

// --- Lògica del Temporitzador (5 minuts) ---
const tempsRestant = ref(300);
let intervalId = null;

function formatarTemps(segons) {
  const min = Math.floor(segons / 60);
  const seg = segons % 60;
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function iniciarTemporitzador() {
  aturarTemporitzador();
  tempsRestant.value = 300;
  intervalId = setInterval(() => {
    tempsRestant.value--;
    if (tempsRestant.value <= 0) {
      aturarTemporitzador();
      alert("S'ha esgotat el temps de reserva. Tornant a la cartellera.");
      vistaActual.value = 'cartellera';
    }
  }, 1000);
}

function aturarTemporitzador() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
// -------------------------------------------

// Ens baixem les pelis només començar
onMounted(() => {
  cinemaStore.carregarPelicules();
  // Conectar al socket si no lo está
  if (!socketService.socket.connected) {
    socketService.socket.connect();
  }
  // Escuchar el aviso del servidor
  socketService.socket.on("pelicules_actualitzades", () => {
    console.log("¡Cambio detectado! Recargando cartelera...");
    cinemaStore.carregarPelicules(); 
  });
});

onUnmounted(() => {
  aturarTemporitzador();
});

// Vigilem on som per amagar o ensenyar la capçalera i no haver de fer tant scroll
watch(vistaActual, (novaVista) => {
  if (novaVista === 'cartellera' || novaVista === 'sessions') {
    cinemaStore.mostrarCapcalera = novaVista === 'cartellera';
    aturarTemporitzador();
  } else {
    cinemaStore.mostrarCapcalera = false;
  }
}, { immediate: true });

// Si l'usuari s'identifica i tenia una compra a mitges, la reprenem
watch(() => authStore.usuariActual, function (nouUsuari) {
  if (nouUsuari && reservaDeButacaTemporal.value.length > 0) {
    compraRealitzada();
  }
});

// Quan cliques una peli, busquem les seves hores i canviem de vista
async function seleccionarPelicula(pelicula) {
  peliculaActiva.value = pelicula;
  await cinemaStore.carregarSessions(pelicula.id);
  vistaActual.value = 'sessions';
}

// Un cop triada la sessió, mirem quins seients queden lliures
async function seleccionarSessio(sessioId) {
  await cinemaStore.carregarSeients(sessioId);
  vistaActual.value = 'seients';
  iniciarTemporitzador();
}

// Guardem els seients un moment i anem a la pantalla de pagament
function iniciarPasarela(seients) {
  reservaDeButacaTemporal.value = seients;
  vistaActual.value = 'pagament';
}

// Aquí és on fem la màgia de la reserva definitiva
async function compraRealitzada() {
  if (reservaDeButacaTemporal.value.length === 0) {
    return;
  }

  // Si no ha entrat al compte, li ensenyem el formulari primer
  if (!authStore.usuariActual) {
    authStore.mostrarModal = true;
    return;
  }

  try {
    // Anem reservant cada butaca una per una (bucle clàssic)
    const llistaDeButaques = reservaDeButacaTemporal.value;
    for (let i = 0; i < llistaDeButaques.length; i++) {
      const seient = llistaDeButaques[i];
      await api.comprarEntrada({
        usuari_id: authStore.usuariActual.id,
        sessio_id: cinemaStore.sessioActiva.id,
        seient_id: seient.id
      });
    }

    alert("Perfecte! Ja tens les teves entrades reservades.");

    // Refresquem el mapa i tornem a l'inici
    await cinemaStore.carregarSeients(cinemaStore.sessioActiva.id);
    reservaDeButacaTemporal.value = [];
    aturarTemporitzador();
    vistaActual.value = 'cartellera';

  } catch (err) {
    alert("Ostres! Hi ha hagut un error amb la reserva: " + err.message);
  }
}
</script>

<style scoped>
.temporitzador-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.temporitzador-box {
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid #00f2ff;
  border-radius: 12px;
  padding: 12px 24px;
  box-shadow: 0 0 15px rgba(0, 242, 255, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.temporitzador-box.temps-critic {
  border-color: #ff0055;
  box-shadow: 0 0 20px rgba(255, 0, 85, 0.6);
  animation: alert-pulse 1s infinite alternate;
}

.label {
  color: #fff;
  font-size: 0.75rem;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.rellotge {
  color: #00f2ff;
  font-size: 2.2rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
}

.temps-critic .rellotge {
  color: #ff0055;
  text-shadow: 0 0 10px rgba(255, 0, 85, 0.5);
}

@keyframes alert-pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
</style>
