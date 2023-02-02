const { player } = require("./player");
const { items } = require("./items");
let commands = [
  {
    text: ["where", "describe", "location", "look"],
    type: "action",
    f: describeLoc,
  },
  {
    text: ["loot", "search", "open", "take"],
    type: "action",
    f: loot,
  },
  {
    text: ["go", "move", "travel"],
    type: "action",
    f: go,
  },
];

////////////////////////////////////////////
function describeLoc(item = player.location) {
  console.log(item.desc);
}
function loot(container) {
  console.log(`you looted ${container.names[0]}`);
  if (container.items.length > 0) {
    console.log(
      `you found ${container.items.map((item) => {
        return items.find((x) => x.id === item).name;
      })}`
    );
  } else {
    console.log(`you found nothing`);
  }
}

function go(dirLoc) {
  const directions = [
    "north",
    "northwest",
    "west",
    "southwest",
    "south",
    "southeast",
    "east",
    "northeast",
  ];
}

exports.commands = commands;
