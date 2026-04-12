## Context

El flujo de usuario en `front/app/pages/usuario/index.vue` gestiona la navegación entre vistas mediante la variable reactiva `vistaActual`. Actualmente no existe ninguna restricción temporal para que el usuario complete el proceso de compra una vez iniciada la selección de asientos.

## Goals / Non-Goals

**Goals:**
- Implementar una cuenta atrás de 300 segundos (5 minutos) que se inicie al cambiar `vistaActual` a `'seients'`.
- Mostrar el tiempo restante al usuario en un formato amigable (MM:SS).
- Redirigir automáticamente a la cartelera si el tiempo se agota.
- Asegurar que el temporizador se detiene correctamente al finalizar la compra o abandonar el proceso.

**Non-Goals:**
- Implementar persistencia del temporizador en el servidor o `localStorage` (si el usuario refresca, el tiempo se reiniciará por ahora).
- Bloquear asientos en el backend mediante el temporizador (la validación de disponibilidad se hace en el momento del pago).

## Decisions

- **Ubicación de la lógica**: La lógica residirá en `index.vue` para centralizar el control de la navegación y el estado global de la reserva temporal.
- **Estado reactivo**: Se utilizarán dos variables:
    - `tempsRestant`: Segundos restantes.
    - `intervalId`: Referencia al intervalo de JS para poder limpiarlo.
- **UI**: El contador se mostrará en un contenedor flotante o integrado en la cabecera cuando `vistaActual` sea `'seients'` o `'pagament'`. Se usará el estilo neon/retro predominante en el proyecto.
- **Acción de expiración**: Al llegar a `tempsRestant === 0`, se ejecutará un `alert` informativo y se seteará `vistaActual.value = 'cartellera'`.

## Risks / Trade-offs

- **Riesgo**: Si el usuario abre múltiples pestañas, cada una tendrá su propio temporizador independiente. Al ser una validación de frontend, el riesgo es bajo para la integridad de los datos.
- **Trade-off**: No usar `localStorage` simplifica la implementación inicial pero penaliza al usuario en caso de refresco accidental de la página.
