import { setActivePinia, createPinia } from 'pinia';
import { useCinemaStore } from '../stores/cinemaStore';
import { useAuthStore } from '../stores/authStore';

// Mock de l'API
jest.mock('../services/api', () => ({
  api: {
    obtenirPelicules: jest.fn(() => Promise.resolve([{ id: 1, titol: 'Peli Test' }])),
    obtenirSessionsPerPelicula: jest.fn(() => Promise.resolve([{ id: 101, data_hora: '2025-01-01T20:00:00' }])),
    obtenirSessio: jest.fn(() => Promise.resolve({ 
      sessio: { id: 101 }, 
      seients_mapa: [{ id: 1, nombre_seient: 1, ocupat: false }] 
    }))
  }
}));

describe('Pinia Store Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Inicialització correcta del cinemaStore', () => {
    const store = useCinemaStore();
    expect(store.pelicules).toEqual([]);
    expect(store.sessions).toEqual([]);
    expect(store.carregant).toBe(false);
  });

  test('Actualització d\'estat en carregar pel·lícules', async () => {
    const store = useCinemaStore();
    await store.carregarPelicules();
    expect(store.pelicules.length).toBe(1);
    expect(store.pelicules[0].titol).toBe('Peli Test');
  });

  test('Reset d\'estat (simulat)', () => {
    const store = useCinemaStore();
    store.sessioActiva = { id: 1 };
    // Simulació de reset (si el store tingués una acció de reset, la cridaríem)
    store.$reset();
    expect(store.sessioActiva).toBe(null);
  });
});

describe('Auth Store Tests', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
    });
  
    test('Inicialització correcta de l\'authStore', () => {
      const store = useAuthStore();
      expect(store.usuariActual).toBe(null);
      expect(store.mostrarModal).toBe(false);
    });
  });
