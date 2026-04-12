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
    // Portem totes les pelis que tenim a la base de dades
    async carregarPelicules() {
      this.carregant = true;
      try {
        const dades = await api.obtenirPelicules();
        this.pelicules = dades;
      } catch (error) {
        console.error("No s'ha pogut connectar amb l'API per treure les pelis.", error);
      } finally {
        this.carregant = false;
      }
    },

    // Busquem les sessions d'una peli fent servir el seu ID
    async carregarSessions(peliculaId) {
      this.carregant = true;
      try {
        this.sessions = await api.obtenirSessionsPerPelicula(peliculaId);
      } catch (error) {
        console.error("Error al carregar les hores de les sessions.", error);
      } finally {
        this.carregant = false;
      }
    },

    // Agafem tota la info de la sala i mirem quines butaques estan ocupades
    async carregarSeients(sessioId) {
      this.carregant = true;
      try {
        const dades = await api.obtenirSessio(sessioId);
        this.sessioActiva = dades.sessio;
        this.seients = dades.seients_mapa;
      } catch (error) {
        console.error("S'ha tallat la càrrega del mapa de la sala.", error);
      } finally {
        this.carregant = false;
      }
    }
  }
});
