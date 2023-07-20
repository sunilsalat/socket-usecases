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
  players = playersArray;
  if (players[player.indexInArray].playerData) {
    player.locX = players[player.indexInArray].playerData.locX;
    player.locY = players[player.indexInArray].playerData.locY;
  }
});

socket.on("orbSwitch", (data) => {
  // server just told us to replace , absorbed orb in orbs array
  orbs.splice(data.capturedOrbI, 1, data.newOrb);
});

socket.on("PlayerAbsorbed", (absorbData) => {
  document.querySelector(
    "#game-message"
  ).innerHTML = `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy}`;
  document.querySelector("#game-message").style.opacity = 1;
  window.setTimeout(() => {
    document.querySelector("#game-message").style.opacity = 0;
  }, 2000);
});

socket.on("updateLeaderBoard", (leaderBoard) => {
  document.querySelector(".leader-board").innerHTML = "";

  leaderBoard.forEach((p) => {
    if (!p.name) {
      return;
    }
    document.querySelector(
      ".leader-board"
    ).innerHTML += `<li class='leaderboard-player'> ${p.name} - ${p.score} </li>`;
  });
});
