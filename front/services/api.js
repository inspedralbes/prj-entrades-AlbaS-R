const URL_BASE = 'http://localhost:8000/api';

export const api = {
  // Ens baixem tota la cartellera de pel·lícules
  async obtenirPelicules() {
    const resposta = await fetch(`${URL_BASE}/pelicules`);
    return resposta.json();
  },
  
  // Busquem les sessions que té una peli concreta
  async obtenirSessionsPerPelicula(peliculaId) {
    const resposta = await fetch(`${URL_BASE}/sessions?pelicula_id=${peliculaId}`);
    return resposta.json();
  },
  
  // Agafem els detalls d'una sessió i mirem quins seients estan lliures
  async obtenirSessio(id) {
    const resposta = await fetch(`${URL_BASE}/sessions/${id}`);
    return resposta.json();
  },

  // Per entrar al compte amb les credencials
  async iniciarSessio(credencials) {
    const resposta = await fetch(`${URL_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credencials)
    });
    return resposta.json();
  },

  // Per crear un compte nou des de zero
  async registrarUsuari(dades) {
    const resposta = await fetch(`${URL_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dades)
    });
    return resposta.json();
  },

  // Fem la reserva oficial d'una entrada a la fila i seient triats
  async comprarEntrada(dades) {
    const resposta = await fetch(`${URL_BASE}/entrades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dades)
    });
    
    if (!resposta.ok) {
       const resultat = await resposta.json();
       throw new Error(resultat.message || "Alguna cosa ha anat malament al servidor, no s'ha pogut validar.");
    }
    
    return resposta.json();
  },

  // Mirem quines entrades ha comprat l'usuari fins ara
  async obtenirLesMevesEntrades(usuariId) {
    const resposta = await fetch(`${URL_BASE}/entrades/usuari/${usuariId}`);
    return resposta.json();
  }
};
