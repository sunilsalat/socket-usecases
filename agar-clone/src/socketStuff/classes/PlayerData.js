//  Data stored in here is to brodcast to other players
// this is where all the data stored about one player

class PlayerData {
  constructor(playerName, settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 10); // horizantal line
    this.locY = Math.floor(settings.worldHeight * Math.random() + 10); // vertical line
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
    this.orbsAbsorbed = 0;
    this.playersAbsorbed = 0;
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 200 + 50);
    const g = Math.floor(Math.random() * 200 + 50);
    const b = Math.floor(Math.random() * 200 + 50);
    //rbg(112,243,59)
    return `rgb(${r},${g},${b})`;
  }
}

module.exports = PlayerData;
