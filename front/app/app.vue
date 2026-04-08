<template>
  <div>
    <!-- Navegació principal -->
    <div class="capcalera-nav">
      <div class="banner-wrapper">
        <img id="banner" src="/imgclient/banner.png" alt="StarMovie">
      </div>
      <nav class="menu-tiquets">
        <NuxtLink to="/usuario" class="tiquet magenta">Cartellera General</NuxtLink>
        <NuxtLink v-if="authStore.usuariActual" to="/usuario/entrades" class="tiquet cian">Les meves reserves</NuxtLink>
        <NuxtLink v-if="authStore.usuariActual?.is_admin" to="/admin" class="tiquet groc">Gestió Admin</NuxtLink>

        <button v-if="!authStore.usuariActual" class="tiquet verd" @click="authStore.mostrarModal = true">Inicia
          sessió</button>
        <div v-else class="tiquet verd tiquet-usuari">
          <span>{{ authStore.usuariActual.name }}</span>
          <button class="btn-tiquet-interior" @click="authStore.ferLogout()">[SORTIR]</button>
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
import { useAuthStore } from '../stores/authStore';
const authStore = useAuthStore();
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
  padding: 40px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
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

.tiquet:hover,
.tiquet.router-link-active {
  transform: scale(1.05);
  background-color: #1a1a24;
}

.tiquet-usuari {
  display: flex;
  gap: 15px;
}

.btn-tiquet-interior {
  background: transparent;
  border: none;
  color: inherit;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  text-shadow: inherit;
  font-size: 1rem;
  padding: 0;
  transition: color 0.3s;
}

.btn-tiquet-interior:hover {
  color: #fff;
}

.contenidor-app {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
