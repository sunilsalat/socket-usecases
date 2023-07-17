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

    socket.on("joinRoom", async (roomObj, cb) => {
      /* 
        console.log(socket.rooms);
      - socket.rooms return Set(1) { '0c-qqEdlW965uPRfAAAH' , "Editors"} where first is internal room it join automatically,
        it is internal implementation of socket.io
      - As socket can join any one room at a time, so we have to make curr socket to leave other rooms forcefully , before it joins any new one 
       */

      const thisNs = nsData[roomObj.nsId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === roomObj.roomTitle
      );

      const thisChatHistory = thisRoom.history;
      const roomsSocketJoined = socket.rooms;
      let i = 0;
      roomsSocketJoined.forEach((room) => {
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      socket.join(roomObj.roomTitle);

      const sockets = await io
        .of(ns.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();
      cb({ users: sockets.length, chatHistory: thisChatHistory });
    });

    socket.on("newMessageToRoom", (msgObj) => {
      const rooms = Array.from(socket.rooms);
      const currRoom = rooms[1];

      // sending msg back to all the socket of current connect room, including sender

      io.of(ns.endpoint).in(currRoom).emit("newMessage", msgObj);

      const thisNs = nsData[msgObj.selectedNsId];
      const thisRoom = thisNs.rooms.find((room) => room.roomTitle);
      thisRoom.addMessage(msgObj);
    });
  });
});
