const BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Llistar catàleg complet pel·lícules
  async getPelicules() {
    const response = await fetch(`${BASE_URL}/pelicules`);
    return response.json();
  },
  
  // Obtenir sessions filtrades pel ID de la pel·lícula
  async getSessionsByPelicula(peliculaId) {
    const response = await fetch(`${BASE_URL}/sessions?pelicula_id=${peliculaId}`);
    return response.json();
  },
  
  // Obtenir detalls individuals d'una sessió i la seva ocupació
  async getSessio(id) {
    const response = await fetch(`${BASE_URL}/sessions/${id}`);
    return response.json();
  },

  // Autenticació
  async login(credencials) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credencials)
    });
    return response.json();
  },

  // Registre
  async register(dades) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dades)
    });
    return response.json();
  },

  // Processar transacció de compra d'entrada
  async comprarEntrada(dades) {
    const response = await fetch(`${BASE_URL}/entrades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dades)
    });
    
    if (!response.ok) {
       const res = await response.json();
       throw new Error(res.message || "Error intern en la validació del servidor.");
    }
    
    return response.json();
  },

  // Consulta de l'historial privat d'entrades
  async getLesMevesEntrades(usuariId) {
    const response = await fetch(`${BASE_URL}/entrades/usuari/${usuariId}`);
    return response.json();
  }
};
