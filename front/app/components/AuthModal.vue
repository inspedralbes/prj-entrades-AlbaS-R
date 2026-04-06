<template>
  <div class="modal-overlay">
    <div class="modal-container">
      
      <h2>{{ esCreeCompte ? "Crear un compte" : "Identificació necessària" }}</h2>
      
      <div v-if="esCreeCompte" class="form-group">
        <label>Nom complet: </label><br>
        <input type="text" v-model="nom" class="form-input" />
      </div>
      
      <div class="form-group">
        <label>Correu electrònic: </label><br>
        <input type="email" v-model="correu" class="form-input" />
      </div>
      
      <div class="form-group-last">
        <label>Contrasenya: </label><br>
        <input type="password" v-model="password" class="form-input" />
      </div>

      <button v-if="!esCreeCompte" @click="intentarLogin" class="btn-primary">ACCEDIR</button>
      <button v-else @click="intentarRegistre" class="btn-secondary">REGISTRAR-SE</button>
      
      <button @click="$emit('tancar')" class="btn-cancel">Cancel·lar operació</button>

      <hr class="modal-divider">

      <a href="#" @click.prevent="esCreeCompte = !esCreeCompte" class="link-switch">
        {{ esCreeCompte ? "Ja disposes de compte? Inicia Sessió" : "Ets un nou usuari? Crea't un compte associat" }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const emit = defineEmits(['tancar', 'identificat']);

const esCreeCompte = ref(false);
const nom = ref('');
const correu = ref('');
const password = ref('');

async function intentarLogin() {
  const exit = await authStore.ferLogin({ email: correu.value, password: password.value });
  if (exit) {
      emit('identificat');
  } else {
      alert('Correu o contrasenya no vàlids.');
  }
}

async function intentarRegistre() {
  if (!nom.value || !correu.value || password.value.length < 6) {
    alert("Omple tots els camps. La contrasenya ha de mantenir una seguretat mínima de 6 caràcters.");
    return;
  }
  const exit = await authStore.ferRegistre({ name: nom.value, email: correu.value, password: password.value });
  if (exit) {
      emit('identificat');
  } else {
      alert('Error en el registre de camp. Aquest correu ja podria estar en ús.');
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  min-width: 350px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-container h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: #222;
}

.form-group {
  margin-bottom: 12px;
}

.form-group-last {
  margin-bottom: 20px;
}

.form-group label, .form-group-last label {
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn-primary {
  width: 100%;
  margin-bottom: 10px;
  font-weight: bold;
  background: #111;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  width: 100%;
  margin-bottom: 10px;
  font-weight: bold;
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #0056b3;
}

.btn-cancel {
  width: 100%;
  margin-bottom: 20px;
  color: #dc3545;
  background: transparent;
  border: none;
  text-decoration: underline;
  padding: 5px;
}

.btn-cancel:hover {
  color: #a71d2a;
}

.modal-divider {
  border: 0;
  height: 1px;
  background: #eee;
  margin: 15px 0;
}

.link-switch {
  color: #6c757d;
  font-size: 13px;
  text-decoration: none;
  display: block;
  text-align: center;
}

.link-switch:hover {
  color: #343a40;
  text-decoration: underline;
}
</style>
