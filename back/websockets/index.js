const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const socketData = new Map();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // En desarrollo permitimos cualquier origen (Nuxt)
  },
});

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado:", socket.id);

  socket.on("join_session", (sessio_id) => {
    socket.join(`session_${sessio_id}`);
    socketData.set(socket.id, { sessio_id, seients: [] });
  });

  socket.on("seleccionar_seient", (data) => {
    const { sessio_id, seient_id } = data;
    console.log(
      `Seient ${seient_id} seleccionat per usuari ${sessio_id} por ${socket.id}`,
    );
    const dadesUsuari = socketData.get(socket.id);
    if (dadesUsuari) {
      dadesUsuari.seients.push(seient_id);
    }

    socket
      .to(`session_${sessio_id}`)
      .emit("seient_ocupat", { seient_id, socket_id: socket.id });
  });
  socket.on("deseleccionar_seient", (data) => {
    const { sessio_id, seient_id } = data;
    console.log(
      `Seient ${seient_id} deseleccionat per usuari ${sessio_id} por ${socket.id}`,
    );

    const dadesUsuari = socketData.get(socket.id);
    if (dadesUsuari) {
      let novaLlista = [];
      for (let i = 0; i < dadesUsuari.seients.length; i++) {
        if (dadesUsuari.seients[i] !== seient_id) {
          novaLlista.push(dadesUsuari.seients[i]);
        }
      }

      dadesUsuari.seients = novaLlista;
    }
    socket
      .to(`session_${sessio_id}`)
      .emit("seient_desocupat", { seient_id, socket_id: socket.id });
  });

  socket.on("compra_finalitzada", (data) => {
    const { sessio_id, seient_ids } = data;
    console.log(`Compra finalitzada per usuari ${sessio_id} por ${socket.id}`);
    io.to(`session_${sessio_id}`).emit("compra_finalitzada", { seient_ids });
  });

  socket.on("notificar_canvi_pelicules", () => {
    console.log("Un admin ha cambiado las películas. Avisando a todos...");
    io.emit("pelicules_actualitzades");
  });

  socket.on("disconnect", () => {
    const dadesUsuari = socketData.get(socket.id);
    if (dadesUsuari) {
      const sessio_id = dadesUsuari.sessio_id;
      const seients = dadesUsuari.seients;
      for (let i = 0; i < seients.length; i++) {
        let id_per_seient = seients[i];

        socket
          .to(`session_${sessio_id}`)
          .emit("seient_desocupat", { seient_id: id_per_seient });
      }

      socketData.delete(socket.id);
    }
    console.log("Cliente desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Servidor de WebSockets escuchando en el puerto ${PORT}`);
});
