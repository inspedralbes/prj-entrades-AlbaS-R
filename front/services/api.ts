// Aquest arxiu és el nostre "Communication Manager".
// Centralitza absolutament totes les peticions a la base de dades a través de la API.

const BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Llista tota la cartellera de pel·lícules
  async getPelicules() {
    const response = await fetch(`${BASE_URL}/pelicules`);
    return response.json();
  },
  
  // Retorna les sessions filtrades per una pel·lícula en concret
  async getSessionsByPelicula(peliculaId: number) {
    const response = await fetch(`${BASE_URL}/sessions?pelicula_id=${peliculaId}`);
    return response.json();
  },
  
  // Demana la informació d'una sola sessió (amb tota la info de seients i sala)
  async getSessio(id: number) {
    const response = await fetch(`${BASE_URL}/sessions/${id}`);
    return response.json();
  },

  // Simula un enviament de credencials
  async login(credencials: {email: string, password: string}) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credencials)
    });
    return response.json();
  }
};
