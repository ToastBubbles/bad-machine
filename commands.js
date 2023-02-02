const { player } = require("./player");
const { items } = require("./items");
const { locations } = require("./locations");
let commands = [
  {
    text: ["where", "describe", "location", "look", "inspect"],
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
  if (!container) {
    console.log("specify what you would like to search");
  } else {
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
}

function go(dirLoc) {
  let nextPos = null;
  switch (dirLoc) {
    case "north":
      nextPos = [player.location.coords[0], player.location.coords[1] + 1];
      break;
    case "northeast":
      nextPos = [player.location.coords[0] + 1, player.location.coords[1] + 1];
      break;
    case "east":
      nextPos = [player.location.coords[0] + 1, player.location.coords[1]];
      break;
    case "southeast":
      nextPos = [player.location.coords[0] + 1, player.location.coords[1] - 1];
      break;
    case "south":
      nextPos = [player.location.coords[0], player.location.coords[1] - 1];
      break;
    case "southwest":
      nextPos = [player.location.coords[0] - 1, player.location.coords[1] - 1];
      break;
    case "west":
      nextPos = [player.location.coords[0] - 1, player.location.coords[1]];
      break;
    case "northwest":
      nextPos = [player.location.coords[0] - 1, player.location.coords[1] + 1];
      break;
    default:
      break;
  }

  //   let nextLoc = locations.find((x) => x.coords === nextPos);
  let nextLoc = null;
  for (let location of locations) {
    // console.log(location.coords, nextPos);
    if (location.coords[0] == nextPos[0] && location.coords[1] == nextPos[1]) {
      nextLoc = location;
    }
  }
  if (nextLoc != null) {
    player.location = nextLoc;
    console.log(`you are in ${player.location.name}`);
  } else {
    console.log("you can not travel this direction");
  }
}

exports.commands = commands;
