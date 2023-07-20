const io = require("../server").io;
const {
  checkForOrbCollisions,
  checkForPlayerCollisions,
} = require("./checkCollisions");
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
      (player.playerData.locX > 5 && xV < 0) ||
      (player.playerData.locX < settings.worldWidth && xV > 0)
    ) {
      player.playerData.locX += speed * xV;
    }

    if (
      (player.playerData.locY > 5 && yV > 0) ||
      (player.playerData.locY < settings.worldHeight && yV < 0)
    ) {
      player.playerData.locY -= speed * yV;
    }

    // 1. check for tocking player to hit orbs
    // below function take current players and its data, and check for a collisions with orbs  and return its index
    const capturedOrbI = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    if (capturedOrbI != null) {
      // replace collided orbs with new orb
      orbs.splice(capturedOrbI, 1, new Orb(settings));
      // update the client with orbdetail so client update its orbs array
      const orbData = {
        capturedOrbI,
        newOrb: orbs[capturedOrbI],
      };
      // emit to all player playing game
      io.to("game").emit("orbSwitch", orbData);
      io.to("game").emit("updateLeaderBoard", getLeaderBoard());

      // 2. check for players collision and publish to cleint
      const absorbData = checkForPlayerCollisions(
        player.playerData,
        player.playerConfig,
        players,
        playersForUsers,
        socket.id
      );

      if (absorbData) {
        io.to("game").emit("PlayerAbsorbed", absorbData);
        io.to("game").emit("updateLeaderBoard", getLeaderBoard());
      }
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

function getLeaderBoard() {
  const leaderBoard = players.map((p) => {
    if (p.playerData) {
      return {
        name: p.playerData.name,
        score: p.playerData.score,
      };
    }
    return {};
  });

  return leaderBoard;
}
