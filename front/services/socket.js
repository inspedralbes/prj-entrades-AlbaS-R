import { io } from "socket.io-client";

// Conectamos con el servidor de WebSockets
const socket = io("http://localhost:3001", {
    autoConnect: false
});

export const socketService = {
    socket,

    // Función para conectar y entrar en una sala
    entrarASessio(sessioId) {
        if (!socket.connected) {
            socket.connect();
        }
        socket.emit("join_session", sessioId);
    },

    // Avisar que hemos clicado un asiento
    marcarSeient(sessioId, seientId) {
        socket.emit("seleccionar_seient", { sessio_id: sessioId, seient_id: seientId });
    },

    // Avisar que hemos soltado un asiento
    desmarcarSeient(sessioId, seientId) {
        socket.emit("deseleccionar_seient", { sessio_id: sessioId, seient_id: seientId });
    },

    // Avisar que la compra ha tenido éxito
    confirmarCompra(sessioId, seientsIds) {
        socket.emit("compra_finalitzada", { sessio_id: sessioId, seient_ids: seientsIds });
    },

    // Desconectar al salir de la página
    desconnectar() {
        if (socket.connected) {
            socket.disconnect();
        }
    }
};
