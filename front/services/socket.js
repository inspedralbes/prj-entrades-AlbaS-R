import { io } from "socket.io-client";

// Conectamos con el servidor de WebSockets
let socketInstance = null;

const getSocket = () => {
    if (socketInstance) return socketInstance;
    
    const config = useRuntimeConfig();
    const url = config.public.socketUrl || "http://localhost:3001";
    
    socketInstance = io(url, {
        autoConnect: false
    });
    return socketInstance;
};

export const socketService = {
    get socket() {
        return getSocket();
    },

    // Función para conectar y entrar en una sala
    entrarASessio(sessioId) {
        if (!this.socket.connected) {
            this.socket.connect();
        }
        this.socket.emit("join_session", sessioId);
    },

    // Avisar que hemos clicado un asiento
    marcarSeient(sessioId, seientId) {
        this.socket.emit("seleccionar_seient", { sessio_id: sessioId, seient_id: seientId });
    },

    // Avisar que hemos soltado un asiento
    desmarcarSeient(sessioId, seientId) {
        this.socket.emit("deseleccionar_seient", { sessio_id: sessioId, seient_id: seientId });
    },

    // Avisar que la compra ha tenido éxito
    confirmarCompra(sessioId, seientsIds) {
        this.socket.emit("compra_finalitzada", { sessio_id: sessioId, seient_ids: seientsIds });
    },
    
    // Avisar que se ha creado, editado o borrado una película
    notificarCanviPelicules() {
        if (!this.socket.connected) {
            this.socket.connect();
        }
        this.socket.emit("notificar_canvi_pelicules");
    },

    // Desconectar al salir de la página
    desconnectar() {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }
};
