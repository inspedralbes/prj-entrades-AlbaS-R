<template>
  <div>
    <!-- Navegació principal -->
    <!-- Navegació principal - S'amaga durant el procés de compra per evitar scroll innecesari -->
    <div v-if="cinemaStore.mostrarCapcalera" class="capcalera-nav">
      <div class="banner-wrapper">
        <NuxtLink to="/usuario">
          <img id="banner" src="/imgclient/banner.png" alt="StarMovie">
        </NuxtLink>
      </div>
      <nav class="menu-tiquets">
        <!-- BOTÓ INICI / DROPDOWN USUARI -->
        <button v-if="!authStore.usuariActual" class="tiquet verd" @click="authStore.mostrarModal = true">
          Inicia sessió
        </button>

        <div v-else class="dropdown-usuari">
          <button class="tiquet verd" @click="menuObert = !menuObert">
            {{ authStore.usuariActual.name }} <span class="flecha">▼</span>
          </button>

          <div v-if="menuObert" class="menu-desplegable">
            <NuxtLink to="/usuario/entrades" class="opcio-menu" @click="menuObert = false">
              LES MEVES RESERVES
            </NuxtLink>
            <NuxtLink v-if="authStore.usuariActual?.is_admin" to="/admin" class="opcio-menu groc-text"
              @click="menuObert = false">
              GESTIÓ ADMIN
            </NuxtLink>
            <div class="separador"></div>
            <NuxtLink class="opcio-menu sortir" @click="handleLogout" to="/usuario">
              SORTIR
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>

    <div class="contenidor-app">
      <NuxtPage />
    </div>
    <AuthModal v-if="authStore.mostrarModal" @tancar="authStore.mostrarModal = false"
      @identificat="authStore.mostrarModal = false" />

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useCinemaStore } from '../stores/cinemaStore';

const authStore = useAuthStore();
const cinemaStore = useCinemaStore();

const menuObert = ref(false);

const handleLogout = () => {
  menuObert.value = false;
  authStore.ferLogout();
}

// Tancar menú en clicar fora
const tancarSiClicaFora = (e) => {
  if (!e.target.closest('.dropdown-usuari')) {
    menuObert.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', tancarSiClicaFora);
});

onUnmounted(() => {
  window.removeEventListener('click', tancarSiClicaFora);
});
</script>

<style>
/* Estils globals d'aplicació */
body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0b0b14;
  background-image: url('/imgclient/bg-image.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

button {
  cursor: pointer;
}
</style>

<style scoped>
.capcalera-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

#banner {
  width: 100%;
  display: block;
}

.banner-wrapper {
  position: relative;
  max-width: 900px;
  width: 100%;
}

/* Llum esquerra — blau */
.banner-wrapper::before {
  top: 16%;
  content: "";
  position: absolute;
  bottom: -10px;
  left: 13%;
  width: 60%;
  height: 61%;
  background: rgba(0, 243, 255, 0.6);
  filter: blur(20px);
  border-radius: 50%;
  animation: llum-blau 3s ease-in-out infinite;
  z-index: -1;
}

/* Llum dreta — rosa */
.banner-wrapper::after {
  top: 16%;
  content: "";
  position: absolute;
  bottom: -10px;
  right: 13%;
  width: 60%;
  height: 61%;
  background: rgba(255, 0, 170, 0.6);
  filter: blur(20px);
  border-radius: 50%;
  animation: llum-rosa 3s ease-in-out infinite;
  z-index: -1;
}

/* Animació parpadeig */
@keyframes llum-blau {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}

@keyframes llum-rosa {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}



.menu-tiquets {
  position: absolute;
  top: 40px;
  right: 40px;
  display: flex;
  gap: 20px;
  z-index: 100;
}

.tiquet {
  text-decoration: none;
  font-family: 'Trebuchet MS', Arial, sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 12px 25px;
  border-radius: 8px;
  background-color: #0b0b14;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  outline: 2px dashed;
  outline-offset: -6px;
  white-space: nowrap;
}

.tiquet:hover {
  transform: scale(1.05);
  background-color: #1a1a24;
}

.tiquet.verd {
  border-color: #00ff00;
  color: #00ff00;
  text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
}

/* --- DESPLEGABLE USUARI --- */
.dropdown-usuari {
  position: relative;
}

.flecha {
  font-size: 0.8rem;
  margin-left: 8px;
  transition: transform 0.3s;
  display: inline-block;
}

.menu-desplegable {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  width: 280px;
  background: rgba(11, 11, 20, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid #00f3ff;
  border-radius: 12px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(0, 243, 255, 0.3);
  padding: 10px 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Punxa del menú */
.menu-desplegable::before {
  content: "";
  position: absolute;
  top: -10px;
  right: 30px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #00f3ff;
}

.opcio-menu {
  padding: 15px 25px;
  color: #fff;
  text-decoration: none;
  font-family: 'Trebuchet MS', Arial, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
}

.opcio-menu:hover {
  background: rgba(0, 243, 255, 0.1);
  color: #00f3ff;
  padding-left: 30px;
}

.opcio-menu.groc-text {
  color: #ffea00;
}

.opcio-menu.groc-text:hover {
  background: rgba(255, 234, 0, 0.1);
  color: #ffea00;
}

.separador {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 5px 0;
}

.opcio-menu.sortir {
  color: #ff4d4d;
}

.opcio-menu.sortir:hover {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
}

.contenidor-app {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
