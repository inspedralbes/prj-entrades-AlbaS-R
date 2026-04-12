import { useAuthStore } from '../stores/authStore.js';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Si no hi ha cap usuari identificat, o no és administrador (is_admin és fals o 0)
  if (!authStore.usuariActual || !authStore.usuariActual.is_admin) {
    // Si intenta accedir-hi, retornem a l'usuari cap a la portada pública
    return navigateTo('/');
  }
});
