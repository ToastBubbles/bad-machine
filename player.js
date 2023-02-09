let { locations } = require("./locations");
let player = {
  equippedWeapon: 0,
  damage: 1,
  location: locations[0],
  engaged: [],
  inventory: [
    // {
    //   id: 0,
    //   name: "cheese",
    //   value: 1,
    //   type: "food",
    //   desc: "",
    //   quantity: 1,
    // },
    [0, 2],
  ],
};

exports.player = player;
