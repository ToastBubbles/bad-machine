let { locations } = require("./locations");
let player = {
  hp: 100,
  level: [1, 0],
  equippedWeapon: -1,
  defense: 0,
  coins: 20,
  armor: {
    helmet: -1,
    chest: -1,
    legs: -1,
    feet: -1,
  },
  damage: 1,
  location: locations[0],
  engaged: [],
  inventory: [[0, 2]],
};

exports.player = player;
