const socketMain = (io) => {
  io.on("connection", (socket) => {
    const auth = socket.handshake.auth;

    if (auth.token === "239rfaiskdfvq243EGa4q3wefsdad") {
      socket.join("nodeClient");
    } else if (auth.token === "jower34jewrewr") {
      socket.join("reactClient");
    } else {
      socket.disconnect();
    }

    socket.emit("welcome", "Hello There !");

    socket.on("perfData", (perfData) => {
      io.to("reactClient").emit("perfData", perfData);
    });
  });
};

module.exports = { socketMain };
