const express = require("express");
const app = express();
const socketio = require("socket.io");
const nsData = require("./data/namespaces");
const { Room } = require("./classes/Room");

app.use(express.static(__dirname + "/public"));

app.get("/change-ns", (req, res) => {
  nsData[0].addRoom(new Room(0, "Deleted Articles", 0));
  io.of(nsData[0].endpoint).emit("nsChange", nsData[0]);
  res.send("Page hit");
});

const expressServer = app.listen(8000, () => {
  console.log(`server running on 8000..`);
});

const io = socketio(expressServer);

io.on("connection", (socket) => {
  socket.on("client-connect", (data) => {
    socket.emit("nsList", nsData);
  });
});

nsData.forEach((ns) => {
  io.of(ns.endpoint).on("connection", (socket) => {
    // console.log(`Socket ${socket.id} connected to ns ${ns.endpoint}`);

    socket.on("joinRoom", async (roomTitle, cb) => {
      socket.join(roomTitle);
      const sockets = await io.of(ns.endpoint).in(roomTitle).fetchSockets();
      cb({ users: sockets.length });
    });
  });
});
