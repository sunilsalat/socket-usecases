const io = require("../server").io;
// const app = require("../server/app").app;

const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");

const orbs = [];
const players = [];
const playersForUsers = [];
const settings = {
  defaultNumOfOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
  defaultGenericOrbSize: 5,
};

io.on("connection", (socket) => {
  let player = {};
  socket.on("init", (playerObj, cb) => {
    // run only when first player connect , thn it is going to run forever,
    if (players.length === 0) {
      setInterval(() => {
        io.to("game").emit("tick", playersForUsers);
      }, 33); // 30fps is a 1000 millisecond /33
    }

    socket.join("game"); // joining User to game ROOM
    // Creating Player object and returning to client
    const playerName = playerObj.playerName;
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    // Storing player to players array
    players.push(player);
    playersForUsers.push({ playerData });
    cb({ orbs, indexInArray: playersForUsers.length - 1 });
  });

  socket.on("tock", (data) => {
    // client updating its position on server every 33 ms
    if (!player.playerConfig) {
      return;
    }

    speed = player.playerConfig.speed;
    player.playerConfig.xVector = data.xVector;
    player.playerConfig.yVector = data.yVector;
    const xV = player.playerConfig.xVector;
    const yV = player.playerConfig.yVector;

    if (
      (player.playerData.locX < 5 && xV < 0) ||
      (player.playerData.locX > 500 && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > 500 && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }
  });

  socket.on("disconnect", () => {
    // clear interval if no players in the room

    if (players.length === 0) {
      // disconnect
    }
  });
});

initGame();
function initGame() {
  for (let i = 0; i < settings.defaultNumOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}
