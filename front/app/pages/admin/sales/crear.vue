<template>
    <div class="admin-formulario">
        <div class="header-admin">
            <h2>Construir Nova Sala</h2>
            <NuxtLink to="/admin/sales/llistaSales">
                <button class="btn-volver">Tornar a la Llista</button>
            </NuxtLink>
        </div>

        <form @submit.prevent="guardar" class="form-crear">
            <div class="form-group">
                <label>Nom de la Sala *</label>
                <input v-model="form.nom" type="text" required placeholder="Ex: Sala IMAX, Sala 8...">
            </div>

            <div class="form-row">
                <div class="form-group half">
                    <label>Número de Files *</label>
                    <input v-model.number="form.files" type="number" min="1" max="50" required placeholder="Ex: 8">
                </div>
                <div class="form-group half">
                    <label>Seients per Fila *</label>
                    <input v-model.number="form.seients_per_fila" type="number" min="1" max="50" required placeholder="Ex: 15">
                </div>
            </div>

            <!-- Aquí es genera la previsualització màgica automàtica en directe -->
            <div class="preview-box" v-if="form.files > 0 && form.seients_per_fila > 0">
                <p>🏗️ <strong>Plànol calculat automàticament:</strong> Aquesta sala albergarà un total de 
                   <span class="highlight-number">{{ capacitatCalculada }}</span> butaques de seient. 
                   <br><small>(El sistema backend assignarà {{ capacitatCalculada }} registres interns auto-calculats a la base de dades).</small>
                </p>
            </div>

            <div class="form-actions">
                <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>
                <button type="submit" class="btn-guardar" :disabled="guardant">
                    {{ guardant ? 'Construint la geometria...' : 'Guardar Sala a la Base de Dades' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { api } from '../../../../services/api.js';
import { useRouter } from 'vue-router';

// L'escut 
definePageMeta({
    middleware: ['admin'] 
});

const router = useRouter();

const form = ref({
    nom: '',
    files: '',
    seients_per_fila: ''
});

const guardant = ref(false);
const errorMsg = ref('');

// Computed Property: Fa les matemàtiques a temps real abans d'enviar-ho a Laravel
const capacitatCalculada = computed(() => {
    return (form.value.files || 0) * (form.value.seients_per_fila || 0);
});

const guardar = async () => {
    // Validació prèvia
    if (form.value.files < 1 || form.value.seients_per_fila < 1) {
        errorMsg.value = "Has de posar com a mínim 1 fila i 1 seient per construir alguna cosa real.";
        return;
    }

    try {
        guardant.value = true;
        errorMsg.value = '';
        
        // Empaquetem i cridem a la constructora API
        await api.crearSala({
            nom: form.value.nom,
            files: form.value.files,
            seients_per_fila: form.value.seients_per_fila
        });
        
        // Retorn obligatori
        router.push('/admin/sales/llistaSales');
    } catch (e) {
        console.error(e);
        errorMsg.value = "S'ha produït un error de construcció a l'hora d'arribar al servidor.";
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

.admin-formulario { background: #08080c; padding: 40px; border: 4px solid #ffea00; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 234, 0, 0.4), inset 0 0 15px rgba(255, 234, 0, 0.2); max-width: 800px; margin: 0 auto; color: #fff; font-family:"ContentForm";}
.header-admin { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #00f3ff; padding-bottom: 15px; box-shadow:0 10px 10px -10px #00f3ff;}
.header-admin h2 { margin: 0; color: #ff00aa; font-family:"VintageFont"; font-size: 2.2rem; text-shadow:0 0 10px #ff00aa, 0 0 20px #ff00aa; letter-spacing:2px; }
.btn-volver { font-family: "NormalFont"; background: transparent; color: #00f3ff; border: 2px solid #00f3ff; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 1.2rem; transition: 0.3s; box-shadow: 0 0 10px rgba(0, 243, 255, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.2); }
.btn-volver:hover { background: #00f3ff; color: #08080c; box-shadow: 0 0 15px #00f3ff, inset 0 0 10px #00f3ff; }
.form-crear { display: flex; flex-direction: column; gap: 15px; margin-top:20px; }
.form-row { display: flex; gap: 15px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-family:"MovingFont"; color: #ffea00; margin-bottom: 5px; font-size: 1.5rem; letter-spacing:1px; }
.form-group input { padding: 12px; background: #0d0d14; border: 2px solid #ff00aa; border-radius: 8px; font-size: 1.2rem; color:#fff; font-family:"ContentForm"; box-shadow:0 0 10px rgba(255,0,170,0.3), inset 0 0 10px rgba(255,0,170,0.2); transition:0.3s;}
.form-group input:focus { border-color: #00f3ff; outline: none; box-shadow: 0 0 15px rgba(0, 243, 255, 0.5), inset 0 0 15px rgba(0, 243, 255, 0.3); }
.half { flex: 1; }
.form-actions { margin-top: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.error-msg { color: #ff00aa; font-weight: bold; margin: 0; text-shadow:0 0 5px #ff00aa;}
.btn-guardar { font-family: "NormalFont"; background: transparent; color: #66ff66; font-size: 1.5rem; padding: 12px 25px; border: 2px solid #66ff66; border-radius: 30px; font-weight: bold; cursor: pointer; transition: 0.3s; box-shadow:0 0 10px rgba(102,255,102,0.5), inset 0 0 10px rgba(102,255,102,0.3); letter-spacing:1px; text-transform:uppercase;}
.btn-guardar:hover:not(:disabled) { background: #66ff66; color:#08080c; box-shadow:0 0 25px #66ff66, inset 0 0 15px #66ff66;}
.btn-guardar:disabled { opacity: 0.5; cursor: not-allowed; box-shadow:none;}

.preview-box { background: #08080c; border: 2px dashed #00f3ff; padding: 15px; border-radius: 8px; margin-top: 10px; color: #fff; box-shadow:0 0 10px rgba(0,243,255,0.2); font-family:"ContentForm";}
.preview-box p { margin: 0; }
.highlight-number { font-size: 1.5rem; font-weight: 900; color: #ff00aa; text-shadow:0 0 10px #ff00aa;}
</style>
