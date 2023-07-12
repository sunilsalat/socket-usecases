const socket = io("http://localhost:8000");

socket.on("connect", () => {
  console.log("Socket connected!");
  socket.emit("client-connect");
});

socket.on("welcome", (data) => {
  console.log(data);
});
