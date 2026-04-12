## 1. Preparación del Estado y Lógica

- [x] 1.1 Definir variables reactivas `tempsRestant` (300) y `intervalId` en `index.vue`.
- [x] 1.2 Crear función `iniciarTemporitzador()` que gestione el decremento y la expiración.
- [x] 1.3 Crear función `aturarTemporitzador()` para limpiar el `setInterval`.

## 2. Integración con el Flujo de Navegación

- [x] 2.1 Modificar `seleccionarSessio()` para llamar a `iniciarTemporitzador()` al entrar en vista `'seients'`.
- [x] 2.2 Integrar limpieza del temporizador en `compraRealitzada()`.
- [x] 2.3 Asegurar que el temporizador se detiene al volver manualmente a `'sessions'` o `'cartellera'`.

## 3. Interfaz de Usuario (UI)

- [x] 3.1 Añadir contenedor visual para el temporizador en el template de `index.vue`.
- [x] 3.2 Implementar formateo de segundos a MM:SS.
- [x] 3.3 Aplicar estilos retro/neon para que el contador sea visible pero coherente con el diseño.
- [x] 3.4 Añadir feedback visual (color rojo) cuando el tiempo sea crítico (< 1 min).
