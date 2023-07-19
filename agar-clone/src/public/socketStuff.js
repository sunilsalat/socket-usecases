const socket = io.connect("http://localhost:8000");

socket.on("connect", () => {
  console.log(`socket connected to server...`);
});

const init = async () => {
  /*   
     Call server to initalize playerdata and config
  */

  const initRes = await socket.emitWithAck("init", {
    playerName: player.name,
  });

  /* 
    Informing server, curr client's mouse position,
    every 33 milliseconds 
  */
  setInterval(() => {
    socket.emit("tock", {
      xVector: player.xVector ? player.xVector : 0.1,
      yVector: player.yVector ? player.yVector : 0.1,
    });
  }, 33);

  orbs = initRes.orbs;
  player.indexInArray = initRes.indexInArray;
  draw();
};

socket.on("tick", (playersArray) => {
  console.log(playersArray);
  players = playersArray;
  player.locX = players[player.indexInArray].playerData.locX;
  player.locy = players[player.indexInArray].playerData.locy;
});
