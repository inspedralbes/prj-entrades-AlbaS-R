import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: function() {
    return {
      // Emmagatzema tota la informació de compte d'usuari
      usuariActual: null,
      mostrarModal: false
    };
  },
  actions: {
    // Iniciar sessió
    async ferLogin(credencials) {
      const resp = await api.login(credencials);
      if (resp.user) {
        this.usuariActual = resp.user;
        return true; 
      }
      return false; 
    },
    
    // Inserció del referent membre
    async ferRegistre(dades) {
      const resp = await api.register(dades);
      if (resp.user) {
        this.usuariActual = resp.user;
        return true; 
      }
      return false;
    },
    
    // Tancar accés global de la memòria Pinia
    ferLogout() {
      this.usuariActual = null;
    }
  }
});
