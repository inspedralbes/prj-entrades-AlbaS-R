import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useCinemaStore = defineStore('cinema', {
  state: function() {
    return {
      pelicules: [],
      sessions: [],
      sessioActiva: null,
      seients: [],
      carregant: false,
      mostrarCapcalera: true,
    };
  },
  actions: {
    // Obtenir la globalitat de pel·lícules des de l'API
    async fetchPelicules() {
      this.carregant = true;
      try {
        const dades = await api.getPelicules();
        this.pelicules = dades;
      } catch (error) {
        console.error("L'API ha refusat aquesta connexió.", error);
      } finally {
        this.carregant = false;
      }
    },

    // Obtenir sessions filtrant per model id pelicula
    async fetchSessions(peliculaId) {
      this.carregant = true;
      try {
        this.sessions = await api.getSessionsByPelicula(peliculaId);
      } catch (error) {
        console.error("Incapacitat per recuperar el calendari de sessions.", error);
      } finally {
        this.carregant = false;
      }
    },

    // Obtenir la informació de sala i estat dels seients
    async fetchSeients(sessioId) {
      this.carregant = true;
      try {
        const dades = await api.getSessio(sessioId);
        this.sessioActiva = dades.sessio;
        this.seients = dades.seients_mapa;
      } catch (error) {
        console.error("Càrrega de sala virtual avortada", error);
      } finally {
        this.carregant = false;
      }
    }
  }
});
