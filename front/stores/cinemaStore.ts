import { defineStore } from 'pinia';
import { api } from '../services/api';

// Store central del cinema on desarem les dades temporals perquè no hagin de tornar-se a carregar
export const useCinemaStore = defineStore('cinema', {
  state: () => ({
    pelicules: [] as any[], // El catàleg principal
    sessions: [] as any[],  // Els diferents horaris per la peli seleccionada
    sessioActiva: null as any, // La sessió que escollirà del pas 2
    seients: [] as any[],   // El mapa exacte dels seients lliures/ocupats per a la sessió activa
    carregant: false,       // Per mostrar un "Carregant..." si anem lents
  }),
  actions: {
    // Aquesta acció es crida 1 cop només. Llegeix de la API i es guarda la resposta en l'estat local.
    async fetchPelicules() {
      this.carregant = true;
      try {
        const dades = await api.getPelicules();
        this.pelicules = dades;
      } catch (error) {
        console.error("No es poden connectar amb l'API central!", error);
      } finally {
        this.carregant = false;
      }
    },

    // Acció PAS 2: Buscar horaris per a una pel·lícula
    async fetchSessions(peliculaId: number) {
      this.carregant = true;
      try {
        this.sessions = await api.getSessionsByPelicula(peliculaId);
      } catch (error) {
        console.error("Error buscant sessions", error);
      } finally {
        this.carregant = false;
      }
    },

    // Acció PAS 3: Demanar tota la geografia de la sessió escollida per dibuixar seients
    async fetchSeients(sessioId: number) {
      this.carregant = true;
      try {
        const dades = await api.getSessio(sessioId);
        this.sessioActiva = dades.sessio;
        this.seients = dades.seients_mapa; // Màgic! Envia a Pinia la butaca amb el "ocupat: true"!!
      } catch (error) {
        console.error("Error buscant la sala interactiva", error);
      } finally {
        this.carregant = false;
      }
    }
  }
});
