const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8000, () => {
  console.log(`server running on 8000..`);
});

const io = socketio(expressServer, {
  path: "/bad-path",
});

io.on("connection", (socket) => {
  socket.on("send-msg", (data) => {
    console.log(data);
    io.emit("msg-to-all-clients", data);
  });
});
