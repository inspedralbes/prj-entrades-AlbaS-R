<template>
    <div>
        <div v-if="cinemaStore.carregant">
            <p>Carregant dades...</p>
        </div>
        
        <div v-else>
            <!-- Views referenciades de la carpeta components/usuario/ -->
            <UsuarioCartelleraPelicules 
              v-if="vistaActual === 'cartellera'" 
              @seleccioPelicula="seleccionarPelicula" 
            />
            
            <UsuarioLlistaSessions 
              v-else-if="vistaActual === 'sessions'" 
              :peliculaActiva="peliculaActiva"
              @tornar="vistaActual = 'cartellera'"
              @seleccioSessio="seleccionarSessio"
            />

            <UsuarioSeleccioSeients 
              v-else-if="vistaActual === 'seients'"
              @tornar="vistaActual = 'sessions'"
              @comprar="iniciarPasarela"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useCinemaStore } from '../../../stores/cinemaStore';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../services/api';

const cinemaStore = useCinemaStore();
const authStore = useAuthStore();

const vistaActual = ref('cartellera'); 
const peliculaActiva = ref(null);
const reservaDeButacaTemporal = ref(null);

onMounted(function() {
  cinemaStore.fetchPelicules();
});

// Resolució del pendent de compra si s'acaba de detectar accés procedent del modal
watch(() => authStore.usuariActual, function(nouUsuari) {
   if (nouUsuari && reservaDeButacaTemporal.value) {
       compraRealitzada();
   }
});

async function seleccionarPelicula(pelicula) {
  peliculaActiva.value = pelicula;
  await cinemaStore.fetchSessions(pelicula.id);
  vistaActual.value = 'sessions';
}

async function seleccionarSessio(sessioId) {
  await cinemaStore.fetchSeients(sessioId);
  vistaActual.value = 'seients';
}

function iniciarPasarela(seient) {
  reservaDeButacaTemporal.value = seient;
  compraRealitzada();
}

async function compraRealitzada() {
    if (!reservaDeButacaTemporal.value) {
        return;
    }

    if (!authStore.usuariActual) {
        // Activació del component global AuthModal
        authStore.mostrarModal = true;
        return;
    }

    try {
        await api.comprarEntrada({
            usuari_id: authStore.usuariActual.id,
            sessio_id: cinemaStore.sessioActiva.id,
            seient_id: reservaDeButacaTemporal.value.id
        });

        alert("Transacció d'entrada operada sota èxit.");
        
        await cinemaStore.fetchSeients(cinemaStore.sessioActiva.id);
        reservaDeButacaTemporal.value = null;
        
    } catch(err) {
        alert("Operació cancel·lada durant l'accés a l'esquema de dades: " + err.message);
        reservaDeButacaTemporal.value = null;
    }
}
</script>
