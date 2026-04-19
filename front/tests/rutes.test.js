import { createRouter, createWebHistory } from 'vue-router';

// Simulem l'estructura de rutes de l'app
const routes = [
  { path: '/', name: 'index', component: { template: '<div>Home</div>' } },
  { path: '/usuario', name: 'usuario-index', component: { template: '<div>Usuario</div>' } },
  { path: '/admin/pelicules/:id', name: 'admin-peli-id', component: { template: '<div>Admin Peli</div>' } },
  { path: '/login', name: 'login', component: { template: '<div>Login</div>' } }
];

describe('Tests de Rutes', () => {
  let router;

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes
    });
  });

  test('La ruta principal carrega correctament', async () => {
    router.push('/');
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/');
  });

  test('Les rutes dinàmiques capturen els paràmetres', async () => {
    router.push('/admin/pelicules/42');
    await router.isReady();
    expect(router.currentRoute.value.params.id).toBe('42');
    expect(router.currentRoute.value.name).toBe('admin-peli-id');
  });

  test('Redirecció bàsica (simulada)', async () => {
    // Simulem una lògica on si no està loguejat, va a login
    const userLoggedIn = false;
    const targetRoute = '/usuario';
    
    if (!userLoggedIn && targetRoute === '/usuario') {
      router.push('/login');
    } else {
      router.push(targetRoute);
    }
    
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/login');
  });
});
