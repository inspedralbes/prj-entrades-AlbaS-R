const getUrlBase = () => {
    const config = useRuntimeConfig();
    return config.public.apiUrl || 'http://localhost:8000/api';
};

// Funció per carregar el Token d'autenticació a les capçaleres de les peticions
const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  // Comprovem si som al client (navegador) i agafem el token guardat
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Identificador per a Laravel Sanctum
    }
  }
  return headers;
};

export const api = {
  // Ens baixem tota la cartellera de pel·lícules disponibles
  async obtenirPelicules() {
    const resposta = await fetch(`${getUrlBase()}/pelicules`);
    return resposta.json();
  },
  
  // Busquem les sessions programades per una pel·lícula específica
  async obtenirSessionsPerPelicula(peliculaId) {
    const resposta = await fetch(`${getUrlBase()}/sessions?pelicula_id=${peliculaId}`);
    return resposta.json();
  },
  
  // Agafem els detalls concrets d'una sessió i l'estat d'ocupació dels seus seients
  async obtenirSessio(id) {
    const resposta = await fetch(`${getUrlBase()}/sessions/${id}`);
    return resposta.json();
  },

  // Per validar les credencials del compte de l'usuari (Login)
  async iniciarSessio(credencials) {
    const resposta = await fetch(`${getUrlBase()}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credencials)
    });
    return resposta.json();
  },

  // Per donar d'alta un compte d'usuari completament nou (Registre)
  async registrarUsuari(dades) {
    const resposta = await fetch(`${getUrlBase()}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dades)
    });
    return resposta.json();
  },

  // Fem la reserva oficial d'una entrada a la fila i seient seleccionats
  async comprarEntrada(dades) {
    const resposta = await fetch(`${getUrlBase()}/entrades`, {
      method: 'POST',
      headers: getHeaders(), // L'enviem amb el token de seguretat
      body: JSON.stringify(dades)
    });
    
    // Si no dóna el vistiplau, informem l'usuari amb un error
    if (!resposta.ok) {
       const resultat = await resposta.json();
       throw new Error(resultat.message || "Alguna cosa ha anat malament al servidor, no s'ha pogut validar l'entrada.");
    }
    
    return resposta.json();
  },

  // Retorna exclusivament la llista d'entrades comprades per l'usuari que està validat
  async obtenirLesMevesEntrades(usuariId) {
    const resposta = await fetch(`${getUrlBase()}/entrades/usuari/${usuariId}`, {
      headers: getHeaders()
    });
    return resposta.json();
  },

  // ===================================
  // ENDPOINTS EXCLUSIUS D'ADMINISTRACIÓ
  // ===================================

  // Obté tot el repositori sencer de les pel·lícules (incloses les que no estan en cartellera actual)
  async obtenirPeliculesAdmin() {
    const resposta = await fetch(`${getUrlBase()}/admin/pelicules`, { headers: getHeaders() });
    return await resposta.json();
  },

  // Crear Pel·lícula permetent adjuntar imatges reals de l'ordinador (FormData)
  async crearPelicula(dadesFormData) {
    const headers = getHeaders();
    delete headers['Content-Type']; // Suprimim l'etiqueta JSON perquè utilitzem form-data
    const resposta = await fetch(`${getUrlBase()}/admin/pelicules`, {
      method: 'POST',
      headers: headers,
      body: dadesFormData
    });
    return await resposta.json();
  },

  // Esborrar definitivament una pel·lícula del sistema
  async esborrarPelicula(id) {
    const resposta = await fetch(`${getUrlBase()}/admin/pelicules/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await resposta.json();
  },

  // Demanar a la base de dades quines sales físiques tenim disponibles
  async obtenirSales() {
    const resposta = await fetch(`${getUrlBase()}/admin/sales`, { headers: getHeaders() });
    return await resposta.json();
  },

  // Obtenir de forma individual els detalls d'una pel·lícula
  async obtenirPelicula(id) {
    const resposta = await fetch(`${getUrlBase()}/pelicules/${id}`);
    return await resposta.json();
  },

  // Modificar les dades de la pel·lícula (permetent el canvi de la fotografia)
  async actualitzarPelicula(id, dadesFormData) {
    const headers = getHeaders();
    delete headers['Content-Type'];
    // Enviem la petició com a POST i afegim "_method = PUT", necessari perquè Laravel processi l'arxiu correctament
    dadesFormData.append('_method', 'PUT');
    const resposta = await fetch(`${getUrlBase()}/admin/pelicules/${id}`, {
      method: 'POST',
      headers: headers,
      body: dadesFormData
    });
    return await resposta.json();
  },
  
  // Guardar a la base de dades una nova sessió a una hora i data delimitades
  async crearSessio(dades) {
    const resposta = await fetch(`${getUrlBase()}/admin/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dades)
    });
    return await resposta.json();
  },

  // Cancel·lar (Eliminar completament) una sessió 
  async esborrarSessio(id) {
    const resposta = await fetch(`${getUrlBase()}/admin/sessions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await resposta.json();
  },

  // Construir una sala física completament nova i generar els seus seients
  async crearSala(dades) {
    const resposta = await fetch(`${getUrlBase()}/admin/sales`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dades)
    });
    return await resposta.json();
  },
  // Demolir una sala (només protegint les que tenen entrades)
  async esborrarSala(id) {
    const resposta = await fetch(`${getUrlBase()}/admin/sales/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    // Si rebem l'error d'escut del backend (l'Error 403), disparem l'alerta vermella al moment!
    if (!resposta.ok) {
        const error = await resposta.json();
        throw new Error(error.message || "No s'ha pogut esborrar la sala per un motiu de servidor.");
    }
    
    return await resposta.json();
  }

};
