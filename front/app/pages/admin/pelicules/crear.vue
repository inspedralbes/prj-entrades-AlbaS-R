<template>
    <div class="admin-formulario">
        <div class="header-admin">
            <h2>Afegir una Pel·lícula al Sistema</h2>
            <NuxtLink to="/admin/pelicules/llistaPelicules">
                <button class="btn-volver">Tornar a la Llista</button>
            </NuxtLink>
        </div>

        <form @submit.prevent="guardar" class="form-crear">
            <div class="form-group">
                <label>Títol *</label>
                <input v-model="form.titol" type="text" required placeholder="Ex: Matrix">
            </div>

            <div class="form-group">
                <label>Descripció *</label>
                <textarea v-model="form.descripcio" required rows="4"
                    placeholder="Sinopsi de la pel·lícula..."></textarea>
            </div>

            <div class="form-row">
                <div class="form-group half">
                    <label>Any *</label>
                    <input v-model="form.any" type="text" required placeholder="Ex: 1999">
                </div>
                <div class="form-group half">
                    <label>Gènere *</label>
                    <input v-model="form.genere" type="text" required placeholder="Ex: Sci-Fi, Acció">
                </div>
            </div>

            <div class="form-group">
                <label>Pòster de la Pel·lícula (Puja un arxiu del teu ordinador) *</label>
                <input type="file" @change="alSeleccionarImagen" accept="image/*" required>
            </div>


            <div class="form-row">
                <div class="form-group half">
                    <label>Director</label>
                    <input v-model="form.director" type="text" placeholder="Ex: Germanes Wachowski (Opcional)">
                </div>
                <div class="form-group half">
                    <label>Actors Principals</label>
                    <input v-model="form.actors" type="text" placeholder="Ex: Keanu Reeves... (Opcional)">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group third">
                    <label>Durada</label>
                    <input v-model="form.durada" type="text" placeholder="Ex: 136 min (Opcional)">
                </div>
                <div class="form-group third">
                    <label>Idioma</label>
                    <input v-model="form.idioma" type="text" placeholder="Ex: Castellà (Opcional)">
                </div>
                <div class="form-group third">
                    <label>Edat Recomanada</label>
                    <input v-model="form.edat_recomanada" type="text" placeholder="Ex: +16 (Opcional)">
                </div>
            </div>

            <div class="form-actions">
                <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>
                <button type="submit" class="btn-guardar" :disabled="guardant">
                    {{ guardant ? 'Guardant la pel·lícula...' : 'Guardar Pel·lícula a la Base de Dades' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { api } from '../../../../services/api';
import { useRouter } from 'vue-router';

// Mantenim l'usuari protegit i restringim l'accés
definePageMeta({
    middleware: ['admin']
});

const router = useRouter();

const form = ref({
    titol: '',
    descripcio: '',
    any: '',
    genere: '',
    director: '',
    actors: '',
    durada: '',
    idioma: '',
    edat_recomanada: ''
});

const archivoImagen = ref(null);
const guardant = ref(false);
const errorMsg = ref('');

// Quan l'usuari tria la foto del seu ordinador
const alSeleccionarImagen = (event) => {
    archivoImagen.value = event.target.files[0];
};

// Funció que empaqueta totes les dades per ser enviades a Laravel
const guardar = async () => {
    try {
        guardant.value = true;
        errorMsg.value = '';

        // Creem el FormData per poder processar fotografies junt amb textos
        const formData = new FormData();
        formData.append('titol', form.value.titol);
        formData.append('descripcio', form.value.descripcio);
        formData.append('any', form.value.any);
        formData.append('genere', form.value.genere);
        
        // Enviem dades opcionals si l'usuari n'ha escrit alguna
        if (form.value.director) formData.append('director', form.value.director);
        if (form.value.actors) formData.append('actors', form.value.actors);
        if (form.value.durada) formData.append('durada', form.value.durada);
        if (form.value.idioma) formData.append('idioma', form.value.idioma);
        if (form.value.edat_recomanada) formData.append('edat_recomanada', form.value.edat_recomanada);
        
        // Adjuntem l'arxiu físic perquè el backend el processi
        if (archivoImagen.value) {
            formData.append('imatge_url', archivoImagen.value);
        }
        
        // Fem la petició a la base de dades
        await api.crearPelicula(formData);
        socketService.notificarCanviPelicules();
        // Si tot va bé, redirigim forçosament a la llista d'administració
        router.push('/admin/pelicules/llistaPelicules');
    } catch (e) {
        console.error(e);
        errorMsg.value = 'S\'ha produït un error a l\'hora de guardar o enviar l\'arxiu.';
    } finally {
        guardant.value = false;
    }
};
</script>

<style scoped>
@font-face { font-family: "VintageFont"; src: url("/fonts/neon_light/NeonLight-Regular.ttf") format("truetype"); }
@font-face { font-family: "NormalFont"; src: url("/fonts/tt-directors-demo.bl-regular.ttf") format("truetype"); }
@font-face { font-family: "MovingFont"; src: url("/fonts/moving.regular.otf") format("truetype"); }
@font-face { font-family: "ContentForm"; src: url("/fonts/black-writing.regular.ttf") format("truetype"); }

.admin-formulario {
    background: #08080c;
    padding: 40px;
    border: 4px solid #ffea00;
    border-radius: 12px;
    box-shadow: 0 0 25px rgba(255, 234, 0, 0.4), inset 0 0 15px rgba(255, 234, 0, 0.2);
    max-width: 800px;
    margin: 0 auto;
    color: #fff;
    font-family: "ContentForm";
}

.header-admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    border-bottom: 2px solid #00f3ff;
    padding-bottom: 15px;
    box-shadow: 0 10px 10px -10px #00f3ff;
}

.header-admin h2 {
    margin: 0;
    color: #ff00aa;
    font-size: 2.2rem;
    font-family: "VintageFont";
    text-shadow: 0 0 10px #ff00aa, 0 0 20px #ff00aa;
    letter-spacing: 2px;
}

.btn-volver {
    font-family: "NormalFont";
    background: transparent;
    color: #00f3ff;
    border: 2px solid #00f3ff;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.3s;
    box-shadow: 0 0 10px rgba(0, 243, 255, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.2);
}

.btn-volver:hover {
    background: #00f3ff;
    color: #08080c;
    box-shadow: 0 0 15px #00f3ff, inset 0 0 10px #00f3ff;
}

.form-crear {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

.form-row {
    display: flex;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-family: "MovingFont";
    color: #ffea00;
    margin-bottom: 5px;
    font-size: 1.5rem;
    letter-spacing: 1px;
}

.form-group input,
.form-group textarea {
    padding: 12px;
    background: #0d0d14;
    border: 2px solid #ff00aa;
    border-radius: 8px;
    font-size: 1.2rem;
    color: #fff;
    font-family: "ContentForm";
    box-shadow: 0 0 10px rgba(255, 0, 170, 0.3), inset 0 0 10px rgba(255, 0, 170, 0.2);
    transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: #00f3ff;
    outline: none;
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.5), inset 0 0 15px rgba(0, 243, 255, 0.3);
}

.half, .third {
    flex: 1;
}

.error-msg {
    color: #ff00aa;
    font-weight: bold;
    margin: 0;
    font-size: 1.2rem;
    text-shadow: 0 0 10px #ff00aa;
}

.btn-guardar {
    font-family: "NormalFont";
    background: transparent;
    color: #66ff66;
    font-size: 1.5rem;
    padding: 12px 25px;
    border: 2px solid #66ff66;
    border-radius: 30px;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 0 10px rgba(102, 255, 102, 0.5), inset 0 0 10px rgba(102, 255, 102, 0.3);
    letter-spacing: 1px;
    text-transform: uppercase;
}

.btn-guardar:hover:not(:disabled) {
    background: #66ff66;
    color: #08080c;
    box-shadow: 0 0 25px #66ff66, inset 0 0 15px #66ff66;
}

.btn-guardar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
}
</style>
