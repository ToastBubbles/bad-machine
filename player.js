let { locations } = require("./locations");
let player = {
  hp: 100,
  equippedWeapon: 0,
  damage: 1,
  location: locations[0],
  engaged: [],
  inventory: [[0, 2]],
};

exports.player = player;
