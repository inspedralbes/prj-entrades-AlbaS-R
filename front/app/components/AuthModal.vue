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
  font-family: "MovingFont";
  src: url("/fonts/moving.regular.otf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "ContentForm";
  src: url("/fonts/black-writing.regular.ttf") format("truetype");
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(8, 8, 12, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-container {
  background: #08080c;
  border: 4px solid #ff00aa;
  border-radius: 12px;
  box-shadow: 
    0 0 25px rgba(255, 0, 170, 0.6),
    inset 0 0 25px rgba(255, 0, 170, 0.4);
  padding: 40px;
  min-width: 400px;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.modal-container h2 {
  font-family: "VintageFont";
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 2.8rem;
  color: #00f3ff;
  text-shadow: 
    0 0 10px #00f3ff, 
    0 0 20px #00f3ff, 
    0 0 30px rgba(0, 243, 255, 0.5);
  text-align: center;
  letter-spacing: 2px;
}

.form-group, .form-group-last {
  margin-bottom: 25px;
}

.form-group label, .form-group-last label {
  font-family: "MovingFont";
  font-size: 1.6rem;
  color: #ffea00;
  letter-spacing: 1px;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  margin-top: 5px;
  background: #0d0d14;
  border: 2px solid #00f3ff;
  border-radius: 8px;
  color: #fff;
  font-family: "ContentForm";
  font-size: 1.4rem;
  box-sizing: border-box;
  box-shadow: 
    0 0 10px rgba(0, 243, 255, 0.3), 
    inset 0 0 10px rgba(0, 243, 255, 0.2);
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #ff00aa;
  box-shadow: 
    0 0 15px rgba(255, 0, 170, 0.5), 
    inset 0 0 15px rgba(255, 0, 170, 0.3);
}

.btn-primary {
  font-family: "NormalFont";
  width: 100%;
  margin-bottom: 12px;
  font-size: 1.6rem;
  background: transparent;
  color: #00f3ff;
  border: 2px solid #00f3ff;
  padding: 12px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.5), inset 0 0 10px rgba(0, 243, 255, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.btn-primary:hover {
  background: #00f3ff;
  color: #08080c;
  box-shadow: 0 0 25px #00f3ff, inset 0 0 15px #00f3ff;
}

.btn-secondary {
  font-family: "NormalFont";
  width: 100%;
  margin-bottom: 12px;
  font-size: 1.6rem;
  background: transparent;
  color: #ff00aa;
  border: 2px solid #ff00aa;
  padding: 12px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 0, 170, 0.5), inset 0 0 10px rgba(255, 0, 170, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.btn-secondary:hover {
  background: #ff00aa;
  color: #08080c;
  box-shadow: 0 0 25px #ff00aa, inset 0 0 15px #ff00aa;
}

.btn-cancel {
  font-family: "NormalFont";
  width: 100%;
  margin-bottom: 20px;
  color: #ffea00;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  letter-spacing: 1px;
}

.btn-cancel:hover {
  color: #fff;
  text-shadow: 0 0 10px #ffea00, 0 0 20px #ffea00;
}

.modal-divider {
  border: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff00aa, transparent);
  margin: 20px 0;
  box-shadow: 0 0 10px #ff00aa;
}

.link-switch {
  font-family: "NormalFont";
  color: #66ff66;
  font-size: 1.3rem;
  text-decoration: none;
  display: block;
  text-align: center;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  margin-top: 10px;
}

.link-switch:hover {
  color: #fff;
  text-shadow: 0 0 10px #66ff66, 0 0 20px #66ff66;
}
</style>
