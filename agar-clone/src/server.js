const express = require("express");
const socketio = require("socket.io");
const app = express();
app.use(express.static(__dirname + "/public"));
const expressServer = app.listen(8000, () => {
  console.log(`server running on 8000..`);
});

const io = socketio(expressServer);

module.exports = { expressServer, io };
