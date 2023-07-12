const express = require("express");
const app = express();
const socketio = require("socket.io");
const nsData = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8000, () => {
  console.log(`server running on 8000..`);
});

const io = socketio(expressServer);

io.on("connection", (socket) => {
  socket.emit("welcome", "Welcome to the server!");
  socket.on("client-connect", (data) => {
    socket.emit("nsList", nsData);
  });
});
