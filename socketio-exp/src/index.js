const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8000, () => {
  console.log(`server running on 8000..`);
});

const io = socketio(expressServer);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.emit("msg-from-server", { data: "Msg from server" });

  socket.on("msg-from-client", (data) => {
    console.log(data);
  });
});
