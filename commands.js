const { player } = require("./player");
const { items } = require("./items");
const { locations } = require("./locations");

let commands = [
  {
    text: ["help", "commands"],
    desc: "list commands",
    type: "action",
    f: help,
  },
  {
    text: ["where", "describe", "location", "look", "inspect"],
    desc: "describe location or object",
    type: "action",
    f: describeLoc,
  },
  {
    text: ["loot", "search", "open", "take"],
    desc: "loot a specified container",
    type: "action",
    f: loot,
  },
  {
    text: ["go", "move", "travel"],
    desc: "go in a specified direction",
    type: "action",
    f: go,
  },
  {
    text: ["inventory", "backpack", "inv"],
    desc: "view inventory",
    type: "action",
    f: printInv,
  },
  {
    text: [
      "dance",
      "yell",
      "sing",
      "twerk",
      "shrimp",
      "crawl",
      "jump",
      "leap",
      "crumble",
      "cry",
      "sniff",
      "weep",
      "dissolve",
    ],
    desc: "waste time",
    type: "silly",
    f: silly,
  },
];

function help() {
  console.log("commands:");
  for (let command of commands) {
    console.log(
      `use || ${command.text.join("  ").padEnd(70, ".")} || to ${command.desc}`
    );
  }
}
////////////////////////////////////////////
function describeLoc(item = player.location) {
  //   console.log(item);
  console.log(item.desc);
}
///////////////////
function printInv() {
  if (player.inventory.length > 0) {
    for (let item of player.inventory) {
      let mappedItem = items.find((x) => x.id === item[0]);

      console.log(`you have ${item[1]} ${mappedItem.name}`);
    }
  } else {
    console.log(
      "you have a legendary beskar steel sword and 1,230,420 gold coins"
    );
    // setTimeout(() => {
    console.log("lol jk, u aint got shit");
    // }, 1500);
  }
}
/////////////////////
function silly(action) {
  console.log(`you ${action}`);
}
/////////////////////
function loot(container) {
  if (!container) {
    console.log("specify what you would like to search");
  } else if (!container.looted) {
    console.log(`you looted ${container.names[0]}`);

    if (container.items.length > 1) {
      container.items.forEach((foundItem) => {
        let mappedItem = items.find((x) => x.id === foundItem[0]);
        console.log(`you found ${foundItem[1]} ${mappedItem.name}`);
        let isAdded = false;
        if (player.inventory.length > 0) {
          player.inventory.forEach((ownedItem) => {
            if (ownedItem[0] === foundItem[0]) {
              ownedItem[1] += foundItem[1];
              isAdded = true;
            }
          });
        }
        if (!isAdded) {
          player.inventory.push(foundItem);
          isAdded = true;
        }
      });
      container.looted = true;
    } else if (container.items.length == 1) {
      let foundItem = container.items[0];
      console.log(`you found ${foundItem.quantity} ${foundItem.name}`);
      let isAdded = false;
      if (player.inventory.length > 0) {
        player.inventory.forEach((ownedItem) => {
          if (ownedItem[0] == foundItem[0]) {
            ownedItem[1] += foundItem[1];
            isAdded = true;
          }
        });
      }
      if (!isAdded) {
        player.inventory.push(foundItem);
      }
      container.looted = true;
    } else {
      console.log(`you found nothing`);
      container.looted = true;
    }
  } else {
    console.log(`the ${container.names[0]} has already been ransacked...`);
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
