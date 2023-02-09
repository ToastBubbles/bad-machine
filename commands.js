const { player } = require("./player");
const { items } = require("./items");
const { locations } = require("./locations");
const { enemies } = require("./enemies");
// const { randomBytes } = require("crypto");

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
    text: ["attack"],
    desc: "attack",
    type: "attack",
    f: attack,
  },
  {
    text: ["equip"],
    desc: "equip an item",
    type: "action",
    f: equip,
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
  console.log(item.desc);
}
///////////////////
function printInv() {
  if (player.inventory.length > 0) {
    for (let item of player.inventory) {
      let mappedItem = items.find((x) => x.id === item[0]);

      console.log(
        `you have \x1b[33m${item[1]} \x1b[32m${mappedItem.name}\x1b[0m`
      );
    }
  } else {
    console.log(
      "you have a legendary beskar steel sword and 1,230,420 gold coins"
    );
    // setTimeout(() => {
    console.log("\x1b[90mlol jk, u aint got shit\x1b[0m");
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
    console.log("\x1b[90mspecify what you would like to search\x1b[0m");
  } else if (!container.looted) {
    console.log(`you looted \x1b[94m${container.names[0]}\x1b[0m`);

    if (container.items.length > 0) {
      container.items.forEach((foundItem) => {
        let mappedItem = items.find((x) => x.id === foundItem[0]);
        console.log(
          `you found \x1b[32m${foundItem[1]} ${mappedItem.name}\x1b[0m`
        );
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
    }
    // else if (container.items.length == 1) {
    //   let foundItem = container.items[0];
    //   let mappedItem = items.find((x) => x.id === foundItem[0]);
    //   console.log(`you found ${foundItem[1]} ${mappedItem.name}`);
    //   let isAdded = false;
    //   if (player.inventory.length > 0) {
    //     player.inventory.forEach((ownedItem) => {
    //       if (ownedItem[0] == foundItem[0]) {
    //         ownedItem[1] += foundItem[1];
    //         isAdded = true;
    //       }
    //     });
    //   }
    //   if (!isAdded) {
    //     player.inventory.push(foundItem);
    //   }
    //   container.looted = true;
    // }
    else {
      console.log(`\x1b[90myou found nothing\x1b[0m`);
      container.looted = true;
    }
  } else {
    console.log(
      `\x1b[90mthe \x1b[94m${container.names[0]}\x1b[90m has already been ransacked...\x1b[0m`
    );
  }
}

function go(dirLoc) {
  if (player.engaged.length == 0) {
    let nextPos = null;
    let canMove = true;
    switch (dirLoc) {
      case "north":
        nextPos = [player.location.coords[0], player.location.coords[1] + 1];
        break;
      case "northeast":
        nextPos = [
          player.location.coords[0] + 1,
          player.location.coords[1] + 1,
        ];
        break;
      case "east":
        nextPos = [player.location.coords[0] + 1, player.location.coords[1]];
        break;
      case "southeast":
        nextPos = [
          player.location.coords[0] + 1,
          player.location.coords[1] - 1,
        ];
        break;
      case "south":
        nextPos = [player.location.coords[0], player.location.coords[1] - 1];
        break;
      case "southwest":
        nextPos = [
          player.location.coords[0] - 1,
          player.location.coords[1] - 1,
        ];
        break;
      case "west":
        nextPos = [player.location.coords[0] - 1, player.location.coords[1]];
        break;
      case "northwest":
        nextPos = [
          player.location.coords[0] - 1,
          player.location.coords[1] + 1,
        ];
        break;
      default:
        canMove = false;
        break;
    }
    if (canMove) {
      let nextLoc = null;
      for (let location of locations) {
        if (
          location.coords[0] == nextPos[0] &&
          location.coords[1] == nextPos[1]
        ) {
          nextLoc = location;
        }
      }
      if (nextLoc != null) {
        let lastLoc = player.location;

        player.location = nextLoc;
        console.log(`you are in \x1b[94m${player.location.name}\x1b[0m`);
        if (nextLoc.atmos.type === "hazardous") {
          if (lastLoc.atmos.type === "safe") {
            console.log("\x1b[33myou do not feel safe here\x1b[0m");
            if (nextLoc.atmos.randEnemies) {
              diceRoll(99) && spawnEnemy();
            } else {
              spawnLocalEnemy();
            }
          }
        } else if (
          lastLoc.atmos.type === "hazardous" &&
          nextLoc.atmos.type === "safe"
        ) {
          console.log("\x1b[92myou feel safe again\x1b[0m");
        }
      } else {
        console.log("\x1b[90myou can not travel this direction\x1b[0m");
      }
    } else {
      console.log("\x1b[90mthat is not a valid direction\x1b[0m");
    }
  } else {
    console.log("\x1b[91myou cannot escape this enemy\x1b[0m");
  }
}
function diceRoll(chance) {
  let rand = Math.random() * 100;
  if (rand < chance) {
    return true;
  }
}

function spawnEnemy() {
  // player.engaged = true;
  // player.location.atmos.enemies.forEach((enemy) => {
  //   player.engaged.push([enem[0], enemy[1]]);
  // });
  let potentialEnemies = [];
  enemies.forEach((enemy) => {
    if (
      enemy.level > player.location.atmos.level - 1 &&
      enemy.level < player.location.atmos.level + 1
    ) {
      potentialEnemies.push(enemy);
    }
  });
  let randIndex = Math.abs(
    Math.round(Math.random() * potentialEnemies.length - 1)
  );
  // console.log(randIndex);
  player.engaged.push([potentialEnemies[randIndex].id, 1]);
  console.log(
    `you have encountered a \x1b[31m${
      enemies.find((x) => x.id === player.engaged[0][0]).name
    }\x1b[0m`
  );
  // player.location.level;
}
function spawnLocalEnemy() {}

function equip(name = "") {
  // console.log(name);
  if (name.length > 0) {
    let item = items.find((x) => x.name == name);
    // console.log(item);
    if (item.type == "sword") {
      player.equippedWeapon = item.id;
      console.log(`you equipped \x1b[32m${name}\x1b[0m`);
      player.damage = item.damage;
    } else {
      console.log(`you cannot equip \x1b[32m${name}\x1b[0m`);
    }
  } else {
    console.log("\x1b[90mplease specify what you would like to equip\x1b[0m");
    // player.damage = 1;
  }
}
// let curEnemy = {};
let dealtDamage = 0;
function attack(id) {
  if (id) {
    let curEnemy = enemies.find((x) => x.id === id);
    console.log(`you attacked \x1b[31m${curEnemy.name}\x1b[0m`);
    console.log(`you dealt \x1b[31m${player.damage}\x1b[0m damage`);
    dealtDamage += player.damage;
    if (dealtDamage >= curEnemy.hp) {
      console.log(`\x1b[92myou defeated the \x1b[31m${curEnemy.name}\x1b[0m`);
      player.engaged.pop();
      dealtDamage = 0;
    }
  } else {
    console.log("\x1b[90mthere is nothing to attack\x1b[0m");
  }
}

exports.commands = commands;
