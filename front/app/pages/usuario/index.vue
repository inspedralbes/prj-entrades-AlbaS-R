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
            
            <UsuarioSeleccioSessio
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

            <UsuarioPagament
              v-else-if="vistaActual === 'pagament'"
              :peliculaActiva="peliculaActiva"
              :seientsSeleccionats="reservaDeButacaTemporal"
              @tornar="vistaActual = 'seients'"
              @pagat="compraRealitzada"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useCinemaStore } from '../../../stores/cinemaStore';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../services/api';
import UsuarioPagament from '../../components/usuario/Pagament.vue';

const cinemaStore = useCinemaStore();
const authStore = useAuthStore();

const vistaActual = ref('cartellera'); 
const peliculaActiva = ref(null);
const reservaDeButacaTemporal = ref([]);

// Ens baixem les pelis només començar
onMounted(() => {
  cinemaStore.carregarPelicules();
});

// Vigilem on som per amagar o ensenyar la capçalera i no haver de fer tant scroll
watch(vistaActual, (novaVista) => {
  if (novaVista === 'cartellera') {
    cinemaStore.mostrarCapcalera = true;
  } else {
    cinemaStore.mostrarCapcalera = false;
  }
}, { immediate: true });

// Si l'usuari s'identifica i tenia una compra a mitges, la reprenem
watch(() => authStore.usuariActual, function(nouUsuari) {
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
        vistaActual.value = 'cartellera';
        
    } catch(err) {
        alert("Ostres! Hi ha hagut un error amb la reserva: " + err.message);
    }
}
</script>
