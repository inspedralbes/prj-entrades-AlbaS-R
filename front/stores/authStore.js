import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: function() {
    return {
      // Dades de l'usuari que ha entrat i si hem d'ensenyar el modal
      usuariActual: null,
      mostrarModal: false
    };
  },
  actions: {
    // Intentem validar l'usuari amb el seu correu i contrasenya
    async ferLogin(credencials) {
      const resposta = await api.iniciarSessio(credencials);
      if (resposta.user) {
        this.usuariActual = resposta.user;
        return true; 
      }
      return false; 
    },
    
    // Creem un usuari nou i l'enviem a la base de dades
    async ferRegistre(dades) {
      const resposta = await api.registrarUsuari(dades);
      if (resposta.user) {
        this.usuariActual = resposta.user;
        return true; 
      }
      return false;
    },
    
    // Netegem la sessió i tornem a estat anònim
    ferLogout() {
      this.usuariActual = null;
    }
  }
});
