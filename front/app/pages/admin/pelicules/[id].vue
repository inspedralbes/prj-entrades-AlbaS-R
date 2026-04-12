<template>
  <div class="admin-edicion">
    <div class="header-admin">
        <h2>Editar Pel·lícula: <span class="highlight">{{ form.titol }}</span></h2>
        <NuxtLink to="/admin/pelicules/llistaPelicules">
          <button class="btn-volver">Tornar a la Llista</button>
        </NuxtLink>
    </div>

    <!-- Pestanyes o Seccions -->
    <div class="panel-doble">
        
        <!-- SECCIÓ 1: DADES DE LA PEL·LÍCULA -->
        <div class="card-seccion">
            <h3>Modificar Dades</h3>
            <form @submit.prevent="guardarCambios" class="form-crear">
                <div class="form-group">
                    <label>Títol</label>
                    <input v-model="form.titol" type="text" required>
                </div>
                
                <div class="form-group">
                    <label>Descripció</label>
                    <textarea v-model="form.descripcio" required rows="4"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group half">
                        <label>Any</label>
                        <input v-model="form.any" type="text" required>
                    </div>
                    <div class="form-group half">
                        <label>Gènere</label>
                        <input v-model="form.genere" type="text" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Canviar Pòster (Puja arxiu només si vols modificar l'actual)</label>
                    <input type="file" @change="alSeleccionarImagen" accept="image/*" class="input-file">
                    <small style="color:#007BFF; font-weight:bold; margin-top:5px;">Actual: {{ form.imatge_url || 'Cap' }}</small>
                </div>

                <div class="form-row">
                    <div class="form-group third">
                        <label>Director</label>
                        <input v-model="form.director" type="text">
                    </div>
                    <div class="form-group third">
                        <label>Idioma</label>
                        <input v-model="form.idioma" type="text">
                    </div>
                    <div class="form-group third">
                        <label>Edat</label>
                        <input v-model="form.edat_recomanada" type="text">
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-guardar" :disabled="guardant">
                        {{ guardant ? 'Sincronitzant amb el Servidor...' : 'Actualitzar Pel·lícula' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- SECCIÓ 2: CALENDARI DE SESSIONS -->
        <div class="card-seccion">
            <h3>Gestor de Taquilla (Sessions)</h3>
            <p class="desc">Afegeix dates i hores perquè la pel·lícula estigui disponible de cara al públic.</p>
            
            <!-- Llista de sessions actuals -->
            <div class="lista-sessions">
                <div v-for="sesion in sessions" :key="sesion.id" class="fila-sesion">
                    <div class="detalle-fecha">
                        {{ formatDate(sesion.data_hora) }} a les {{ extraerHora(sesion.data_hora) }}
                    </div>
                    <div class="detalle-sala">Sala {{ sesion.sala_id }}</div>
                    <button @click="eliminarSesion(sesion.id)" class="btn-rojo-mini">✖</button>
                </div>
                <div v-if="sessions.length === 0" class="empty">No hi ha sessions a taquilla actualment.</div>
            </div>

            <!-- Formulari ràpid per afegir una nova sessió -->
            <div class="caja-añadir-sesion">
                <h4>Nova Sessió</h4>
                <div class="fila-nueva">
                    <input type="date" v-model="novaSessio.data" required class="input-mini">
                    <input type="time" v-model="novaSessio.hora_inici" required class="input-mini">
                    <select v-model="novaSessio.sala_id" required class="input-mini">
                        <option value="" disabled>Tria Sala...</option>
                        <option v-for="sala in salesDisponibles" :key="sala.id" :value="sala.id">
                            {{ sala.nom }}
                        </option>
                    </select>
                </div>
                <button @click="añadirSesion" class="btn-guardar w-full mt-1">Afegir al Calendari Públic</button>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../../../../services/api.js'; 
import { useRoute } from 'vue-router';

// Assignem el middleware de seguretat
definePageMeta({
  middleware: ['admin']
});

// Rescatem l'ID de la pel·lícula de la pròpia URL gràcies al router
const route = useRoute();
const id_pelicula = route.params.id; 

const form = ref({});
const sessions = ref([]);
const salesDisponibles = ref([]);
const guardant = ref(false);

const novaSessio = ref({
    pelicula_id: id_pelicula,
    sala_id: '',
    data: '',
    hora_inici: ''
});

const archivoImagen = ref(null);

// Mètode per agafar la nova imatge des del navegador
const alSeleccionarImagen = (event) => {
    archivoImagen.value = event.target.files[0];
};

// Obtenir la pel·lícula i les sessions associades des de la base de dades
const cargarTodo = async () => {
    try {
        const dadesPeli = await api.obtenirPelicula(id_pelicula);
        form.value = dadesPeli;
        
        sessions.value = await api.obtenirSessionsPerPelicula(id_pelicula);
        salesDisponibles.value = await api.obtenirSales();
    } catch(e) {
        console.error("S'ha produït un error al carregar dades remotes.", e);
    }
};

// S'executa només entrar
onMounted(() => {
    cargarTodo();
});

// Enviar els canvis actualitzats de la pel·lícula al servidor backend
const guardarCambios = async () => {
    try {
        guardant.value = true;
        
        // Empaquetem en Format Data per la pujada de fotos
        const formData = new FormData();
        formData.append('titol', form.value.titol);
        formData.append('descripcio', form.value.descripcio);
        formData.append('any', form.value.any);
        formData.append('genere', form.value.genere);
        
        if (form.value.director) formData.append('director', form.value.director);
        if (form.value.actors) formData.append('actors', form.value.actors);
        if (form.value.durada) formData.append('durada', form.value.durada);
        if (form.value.idioma) formData.append('idioma', form.value.idioma);
        if (form.value.edat_recomanada) formData.append('edat_recomanada', form.value.edat_recomanada);
        
        // Si s'ha adjuntat un arxiu, el pugem; altrament mantenim l'adreça URL ja existent
        if (archivoImagen.value) {
            formData.append('imagen_archivo', archivoImagen.value);
        } else if (form.value.imatge_url) {
            formData.append('imatge_url', form.value.imatge_url);
        }

        await api.actualitzarPelicula(id_pelicula, formData);
        alert("Pel·lícula actualitzada correctament!");
        
        // Recarreguem la llista de dades a la vista
        await cargarTodo(); 
    } catch(e) {
        console.error(e);
        alert("Oops, error de connexió amb Laravel en el moment d'actualitzar.");
    } finally {
        guardant.value = false;
    }
};

// Afegeix una nova sessió horària connectant les dades per Laravel (data + hora integrades)
const añadirSesion = async () => {
    if (!novaSessio.value.data || !novaSessio.value.hora_inici || !novaSessio.value.sala_id) {
        alert("Si us plau, omple la data, hora i sala completament.");
        return;
    }

    // Adaptem el format combinant data i hora pel camp 'data_hora' de Laravel
    const datosFusionados = {
        pelicula_id: novaSessio.value.pelicula_id,
        sala_id: novaSessio.value.sala_id,
        data_hora: `${novaSessio.value.data} ${novaSessio.value.hora_inici}:00`
    };
    
    try {
        await api.crearSessio(datosFusionados);
        // Netegem els controls perquè quedi en blanc
        novaSessio.value.data = '';
        novaSessio.value.hora_inici = '';
        novaSessio.value.sala_id = '';
        await cargarTodo();
    } catch (e) {
        alert("Error a l'hora de programar la sessió.");
    }
};

// Elimina definitivament la sessió
const eliminarSesion = async (id_sessio) => {
    if(confirm("Segur que vols esborrar aquesta sessió? Pensa que els clients podrien perdre les entrades comprades.")) {
        await api.esborrarSessio(id_sessio);
        await cargarTodo();
    }
};

// Formatem de forma amigable la data de la base de dades
const formatDate = (fechaCompleta) => {
    if(!fechaCompleta) return "";
    return new Date(fechaCompleta).toLocaleDateString('ca-ES', { weekday: 'short', day: '2-digit', month: 'short' });
}

// Extraiem la hora en format visible
const extraerHora = (fechaCompleta) => {
    if(!fechaCompleta) return "";
    return new Date(fechaCompleta).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
@font-face { font-family: "VintageFont"; src: url("/fonts/neon_light/NeonLight-Regular.ttf") format("truetype"); }
@font-face { font-family: "NormalFont"; src: url("/fonts/tt-directors-demo.bl-regular.ttf") format("truetype"); }
@font-face { font-family: "MovingFont"; src: url("/fonts/moving.regular.otf") format("truetype"); }
@font-face { font-family: "ContentForm"; src: url("/fonts/black-writing.regular.ttf") format("truetype"); }

.admin-edicion {
  background: #08080c;
  padding: 40px;
  border-radius: 12px;
  border: 4px solid #ffea00;
  box-shadow: 0 0 25px rgba(255, 234, 0, 0.4), inset 0 0 15px rgba(255, 234, 0, 0.2);
  margin: 0 auto;
  color: #fff;
  font-family: "ContentForm";
}

.header-admin {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #00f3ff; padding-bottom: 15px; box-shadow: 0 10px 10px -10px #00f3ff;
}

.header-admin h2 { margin: 0; color: #ff00aa; font-family: "VintageFont"; font-size: 2.2rem; text-shadow: 0 0 10px #ff00aa, 0 0 20px #ff00aa; letter-spacing: 2px; }
.highlight { color: #00f3ff; text-shadow: 0 0 10px #00f3ff; }

.btn-volver {
    font-family: "NormalFont";
    background: transparent;
    color: #ff00aa;
    border: 2px solid #ff00aa;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.3s;
    box-shadow: 0 0 10px rgba(255, 0, 170, 0.4), inset 0 0 10px rgba(255, 0, 170, 0.2);
}
.btn-volver:hover {
    background: #ff00aa;
    color: #08080c;
    box-shadow: 0 0 15px #ff00aa, inset 0 0 10px #ff00aa;
}

.panel-doble {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 20px;
}

.card-seccion {
    background: #0d0d14;
    padding: 25px;
    border-radius: 8px;
    border: 2px solid #00f3ff;
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.3), inset 0 0 10px rgba(0, 243, 255, 0.1);
}

.card-seccion h3 { border-bottom: 1px solid #00f3ff; padding-bottom: 10px; margin-top:0; color: #ffea00; font-family:"NormalFont"; font-size:1.8rem; letter-spacing: 1px; text-shadow:0 0 5px #ffea00;}

/* Formularis Visuals */
.form-crear { display: flex; flex-direction: column; gap: 15px; }
.form-row { display: flex; gap: 15px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-size: 1.3rem; font-family:"MovingFont"; color: #ff00aa; margin-bottom: 5px;}
.form-group input, .form-group textarea, .form-group select { padding: 10px; background: #08080c; color:#fff; border: 1px solid #ff00aa; border-radius: 4px; font-family:"ContentForm"; font-size:1.1rem; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #00f3ff; outline: none; box-shadow:0 0 10px rgba(0,243,255,0.4); }
.half { flex: 1; } .third { flex: 1; }

.form-actions { margin-top: 15px; text-align: right;}

.btn-guardar {
    font-family: "NormalFont"; background: transparent; border:2px solid #66ff66; color: #66ff66; padding: 12px 20px; border-radius: 30px; font-size:1.3rem; cursor: pointer; transition: 0.3s; box-shadow:0 0 10px rgba(102,255,102,0.4); text-transform:uppercase; letter-spacing:1px;
}
.btn-guardar:hover { background: #66ff66; color:#08080c; box-shadow:0 0 20px #66ff66; }
.w-full { width: 100%; margin-top: 15px;}

/* Zona de taquilla */
.desc { color: #aaa; font-size: 1rem; margin-bottom: 15px; font-family:"ContentForm";}
.lista-sessions {
    max-height: 250px; overflow-y: auto; margin-bottom: 20px;
    padding-right: 5px;
}
.lista-sessions::-webkit-scrollbar { width: 8px; }
.lista-sessions::-webkit-scrollbar-thumb { background: #00f3ff; border-radius: 4px; box-shadow:0 0 5px #00f3ff;}

.fila-sesion {
    display: flex; justify-content: space-between; align-items: center;
    background: #08080c; padding: 12px; border-radius: 5px; margin-bottom: 10px; border:1px solid #00f3ff; box-shadow:0 0 5px rgba(0,243,255,0.2);
}
.detalle-fecha { font-weight: bold; font-size: 1.1rem; text-transform: capitalize; color:#ffea00; font-family:"ContentForm";}
.detalle-sala { background: transparent; color: #ff00aa; border:1px solid #ff00aa; font-family:"NormalFont"; font-size: 1rem; padding: 4px 10px; border-radius: 12px; box-shadow:0 0 5px #ff00aa, inset 0 0 5px #ff00aa;}
.btn-rojo-mini { background: transparent; border: none; color: #ff00aa; font-weight: bold; cursor: pointer; font-size: 1.3rem; transition:0.2s;}
.btn-rojo-mini:hover { color: #fff; text-shadow:0 0 10px #ff00aa, 0 0 20px #ff00aa;}

.empty { color: #ff00aa; text-align: center; padding: 15px; font-style: italic; background:#08080c; border:1px dashed #ff00aa; border-radius: 8px; font-family:"ContentForm";}

.caja-añadir-sesion {
    background: #08080c; padding: 20px; border-radius: 8px; border: 2px dashed #00f3ff; margin-top: 15px; box-shadow:0 0 10px rgba(0,243,255,0.2);
}
.caja-añadir-sesion h4 { margin-top:0; color:#ffea00; font-family:"NormalFont"; font-size:1.5rem; letter-spacing:1px; text-shadow:0 0 5px #ffea00;}
.fila-nueva { display: flex; gap: 10px; }
.input-mini { flex: 1; padding: 10px; border: 1px solid #00f3ff; background:#0d0d14; color:#fff; border-radius: 4px; font-size: 1.1rem; font-family:"ContentForm";}
.input-mini:focus { outline:none; box-shadow:0 0 10px rgba(0,243,255,0.4); border-color:#ffea00;}
</style>
