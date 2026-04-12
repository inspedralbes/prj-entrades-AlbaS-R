<template>
    <div class="admin-pelicules">
        <div class="header-admin">
            <h2>Gestió de Pel·lícules</h2>
            <!-- Botó per afegir una nova pel·lícula a la cartellera -->
            <NuxtLink to="/admin/pelicules/crear">
                <button class="btn-crear">+ Nova Pel·lícula</button>
            </NuxtLink>
        </div>

        <!-- Missatge de càrrega mentre obtenim les dades -->
        <div v-if="carregant" class="loading">Carregant el catàleg de StarMovie...</div>

        <!-- Taula principal de gestió de pel·lícules -->
        <table v-else class="taula-admin">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cartell</th>
                    <th>Títol</th>
                    <th>Etiquetes</th>
                    <th>Accions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="peli in pelicules" :key="peli.id">
                    <td>#{{ peli.id }}</td>
                    <td>
                        <img :src="peli.imatge_url" alt="poster" class="thumb-poster" v-if="peli.imatge_url" />
                        <span v-else class="badge">Sense imatge</span>
                    </td>
                    <td>
                        <strong>{{ peli.titol }}</strong> <br>
                        <small>({{ peli.any }})</small>
                    </td>
                    <td>
                        <span class="badge">{{ peli.genere }}</span>
                        <span class="badge">{{ peli.edat_recomanada }}</span>
                    </td>
                    <td class="acciones">
                        <!-- Enllaç per editar les dades de la pel·lícula i gestionar-ne les sessions -->
                        <NuxtLink :to="`/admin/pelicules/${peli.id}`">
                            <button class="btn-editar">Editar / Sessions</button>
                        </NuxtLink>
                        <!-- Botó per eliminar totalment una pel·lícula de la base de dades -->
                        <button class="btn-borrar" @click="esborrar(peli.id, peli.titol)">Eliminar</button>
                    </td>
                </tr>
                <!-- Si no hi ha dades a mostrar -->
                <tr v-if="pelicules.length === 0">
                    <td colspan="5" class="text-center">No hi ha pel·lícules a la base de dades de moment.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../../../../services/api.js';

// Assignem el middleware de seguretat (només administradors)
definePageMeta({
    middleware: ['admin']
});

const pelicules = ref([]);
const carregant = ref(true);

// Carreguem totes les pel·lícules (incloses les que no tenen sessions)
const carregarDades = async () => {
    try {
        carregant.value = true;
        pelicules.value = await api.obtenirPeliculesAdmin();
    } catch (error) {
        console.error("No s'han pogut carregar les pel·lícules", error);
    } finally {
        carregant.value = false;
    }
};

// S'executa quan el component està construït a la pantalla
onMounted(() => {
    carregarDades();
});

// Funció per confirmar l'eliminació d'una pel·lícula
const esborrar = async (id, titol) => {
    if (confirm(`Estàs segur que vols eliminar la pel·lícula "${titol}" i TOTES les seves sessions per complet?`)) {
        try {
            await api.esborrarPelicula(id);
            // Recarreguem la llista un cop esborrada per veure l'actualització de dades
            socketService.notificarCanviPelicules();
            await carregarDades();
        } catch (error) {
            alert("S'ha produït un error a l'hora d'esborrar la pel·lícula.");
        }
    }
};
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
    font-family: "ContentForm";
    src: url("/fonts/black-writing.regular.ttf") format("truetype");
}

.admin-pelicules {
    background: #08080c;
    padding: 40px;
    border: 4px solid #00f3ff;
    border-radius: 12px;
    box-shadow: 0 0 25px rgba(0, 243, 255, 0.4), inset 0 0 15px rgba(0, 243, 255, 0.2);
    color: #fff;
}

.header-admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #ff00aa;
    padding-bottom: 15px;
    box-shadow: 0 10px 10px -10px #ff00aa;
}

.header-admin h2 {
    margin: 0;
    color: #00f3ff;
    font-family: "VintageFont";
    font-size: 2.5rem;
    text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;
    letter-spacing: 2px;
}

.btn-crear {
    font-family: "NormalFont";
    background: transparent;
    color: #66ff66;
    border: 2px solid #66ff66;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 1.4rem;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(102, 255, 102, 0.5), inset 0 0 10px rgba(102, 255, 102, 0.3);
    transition: all 0.3s;
    letter-spacing: 1px;
}

.btn-crear:hover {
    background: #66ff66;
    color: #08080c;
    box-shadow: 0 0 25px #66ff66, inset 0 0 15px #66ff66;
}

.loading {
    padding: 40px;
    text-align: center;
    color: #ffea00;
    font-size: 1.5rem;
    font-family: "VintageFont";
    text-shadow: 0 0 10px #ffea00;
}

.taula-admin {
    width: 100%;
    border-collapse: collapse;
    font-family: "ContentForm";
    font-size: 1.3rem;
    margin-top: 20px;
}

.taula-admin th,
.taula-admin td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #333;
    vertical-align: middle;
}

.taula-admin th {
    background-color: #111;
    color: #ffea00;
    font-family: "NormalFont";
    font-size: 1.5rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-bottom: 2px solid #ffea00;
    text-shadow: 0 0 5px rgba(255, 234, 0, 0.5);
}

.thumb-poster {
    width: 65px;
    border-radius: 6px;
    border: 2px solid #00f3ff;
    box-shadow: 0 0 10px #00f3ff;
}

.badge {
    background: transparent;
    color: #ff00aa;
    border: 1px solid #ff00aa;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 1rem;
    margin-right: 5px;
    font-family: "NormalFont";
    box-shadow: 0 0 5px rgba(255, 0, 170, 0.5), inset 0 0 5px rgba(255, 0, 170, 0.3);
}

.acciones {
    display: flex;
    gap: 10px;
}

.btn-editar {
    font-family: "NormalFont";
    background: transparent;
    color: #00f3ff;
    border: 2px solid #00f3ff;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s;
    box-shadow: 0 0 8px rgba(0, 243, 255, 0.4), inset 0 0 8px rgba(0, 243, 255, 0.2);
}

.btn-borrar {
    font-family: "NormalFont";
    background: transparent;
    color: #ff00aa;
    border: 2px solid #ff00aa;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s;
    box-shadow: 0 0 8px rgba(255, 0, 170, 0.4), inset 0 0 8px rgba(255, 0, 170, 0.2);
}

.btn-editar:hover {
    background: #00f3ff;
    color: #08080c;
    box-shadow: 0 0 15px #00f3ff, inset 0 0 10px #00f3ff;
}

.btn-borrar:hover {
    background: #ff00aa;
    color: #08080c;
    box-shadow: 0 0 15px #ff00aa, inset 0 0 10px #ff00aa;
}

.text-center {
    text-align: center;
    color: #777;
}
</style>
