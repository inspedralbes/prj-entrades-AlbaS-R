<template>
  <div>
    <!-- Navegació principal -->
    <div class="nav-header">
      <h1>StarMovie</h1>
      
      <nav class="links-router">
        <!-- Enllaços de navegació a les diferents seccions -->
        <NuxtLink to="/usuario" class="nav-item">Cartellera General</NuxtLink>
        <NuxtLink v-if="authStore.usuariActual" to="/usuario/entrades" class="nav-item">Les meves reserves</NuxtLink>
        <NuxtLink v-if="authStore.usuariActual?.is_admin" to="/admin" class="nav-item" style="color: #00ff88;">Gestió Admin</NuxtLink>
      </nav>

      <div>
        <span v-if="authStore.usuariActual">
          Hola, <strong>{{ authStore.usuariActual.name }}</strong> 
          <button class="logout-btn" @click="authStore.ferLogout()">Tancar Sessió</button>
        </span>
        <button class="login-btn" v-else @click="authStore.mostrarModal = true">Inicia sessió / Registre</button>
      </div>
    </div>
    
    <div class="app-container">
        <!-- Contenidor dinàmic per a vistes inferiors de rutes de Vue Router -->
        <NuxtPage />
    </div>

    <!-- Modal d'autenticació gestionat per l'estat global -->
    <AuthModal 
        v-if="authStore.mostrarModal" 
        @tancar="authStore.mostrarModal = false" 
        @identificat="authStore.mostrarModal = false"
    />

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
  background-color: #f8f9fa;
  color: #333;
}
button {
  cursor: pointer;
}
</style>

<style scoped>
.nav-header {
  background-color: #111;
  color: #fff;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.nav-header h1 {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.links-router {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: #ccc;
  text-decoration: none;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 4px;
}

.nav-item:hover, .nav-item.router-link-active {
  color: #fff;
  background: rgba(255,255,255,0.1);
}

.logout-btn, .login-btn {
  margin-left: 15px;
  background-color: #fff;
  color: #111;
  border: 1px solid #ddd;
  padding: 8px 16px;
  font-weight: 600;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.logout-btn:hover, .login-btn:hover {
  background-color: #eee;
}

.app-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
