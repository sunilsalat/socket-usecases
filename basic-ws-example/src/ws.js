const http = require("http");
const websocket = require("ws");

const server = http.createServer();
const wss = new websocket.WebSocketServer({ server });

wss.on("headers", (headers, req) => {});

wss.on("connection", (ws, req) => {
  ws.send("Welcome to web server!!");
  ws.on("message", (data) => {
    console.log(data.toString());
  });
});

server.listen(8000);
