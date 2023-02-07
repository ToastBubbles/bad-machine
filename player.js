let { locations } = require("./locations");
let player = {
  location: locations[0],
  inventory: [
    {
      id: 0,
      name: "cheese",
      value: 1,
      type: "food",
      desc: "",
      quantity: 1,
    },
  ],
};

exports.player = player;
