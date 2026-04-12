## Why

Actualmente, no hay un límite de tiempo para que el usuario seleccione sus asientos o complete el pago. Esto puede llevar a que asientos queden "bloqueados" indefinidamente en el flujo de trabajo del usuario (aunque la lógica de backend actual lo gestione de otra forma, la experiencia de usuario debe ser coherente). 

La implementación de un temporizador de 5 minutos asegura que los usuarios completen su transacción en un tiempo razonable, liberando recursos y manteniendo la fluidez del sistema de ventas.

## What Changes

Se añadirá una lógica de cuenta atrás en la página principal de usuario (`index.vue`). El temporizador:
1. Se iniciará al entrar en la vista de selección de asientos (`seients`).
2. Persistirá durante la pasarela de pago (`pagament`).
3. Se detendrá y limpiará al completar la compra o al volver manualmente a la cartelera o selección de sesiones.
4. Redirigirá automáticamente a la cartelera (`cartellera`) si el tiempo llega a cero, mostrando un aviso al usuario.

## Capabilities

### New Capabilities
- `timer-de-reserva`: Funcionalidad de cuenta atrás de 5 minutos vinculada al estado de la compra.

### Modified Capabilities
- `seleccio-compra`: Integración del temporizador en el flujo de navegación entre `seients`, `pagament` y `cartellera`.

## Impact

- **Frontend**: Afecta principalmente a `front/app/pages/usuario/index.vue`. No se requieren cambios en el backend inicialmente, ya que es una gestión de sesión de usuario en el lado del cliente.
- **UX**: Mejora la sensación de urgencia y gestiona las expectativas del usuario sobre la duración de su reserva temporal.
