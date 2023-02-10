const { player } = require("./player");
const { items } = require("./items");
const { locations } = require("./locations");
const { enemies } = require("./enemies");
const { ANSI } = require("./config");
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
        `you have ${ANSI.green}${item[1]} ${ANSI.green}${mappedItem.name}${ANSI.reset}`
      );
    }
  } else {
    console.log(
      "you have a legendary beskar steel sword and 1,230,420 gold coins"
    );
    // setTimeout(() => {
    console.log(`${ANSI.ltgrey}lol jk, u aint got shit${ANSI.reset}`);
    // }, 1500);
  }
}
/////////////////////
function silly(action) {
  console.log(`you ${action}`);
}
/////////////////////

function addItem(item) {
  let mappedItem = items.find((x) => x.id === item[0]);
  let isAdded = false;
  console.log(
    `you found ${ANSI.green}${item[1]} ${mappedItem.name}${ANSI.reset}`
  );
  if (player.inventory.length > 0) {
    player.inventory.forEach((ownedItem) => {
      if (ownedItem[0] === item[0]) {
        ownedItem[1] += item[1];
        isAdded = true;
      }
    });
  }
  if (!isAdded) {
    player.inventory.push(item);
    isAdded = true;
  }
}
function loot(container) {
  if (!container) {
    console.log(
      `${ANSI.ltgrey}specify what you would like to search${ANSI.reset}`
    );
  } else if (!container.looted) {
    console.log(`you looted ${ANSI.ltblue}${container.names[0]}${ANSI.reset}`);

    if (container.items.length > 0) {
      container.items.forEach((foundItem) => {
        addItem(foundItem);
        // let mappedItem = items.find((x) => x.id === foundItem[0]);
        // console.log(
        //   `you found ${ANSI.green}${foundItem[1]} ${mappedItem.name}${ANSI.reset}`
        // );
        // let isAdded = false;
        // if (player.inventory.length > 0) {
        //   player.inventory.forEach((ownedItem) => {
        //     if (ownedItem[0] === foundItem[0]) {
        //       ownedItem[1] += foundItem[1];
        //       isAdded = true;
        //     }
        //   });
        // }
        // if (!isAdded) {
        //   player.inventory.push(foundItem);
        //   isAdded = true;
        // }
      });
      container.looted = true;
    } else {
      console.log(`${ANSI.ltgrey}you found nothing${ANSI.reset}`);
      container.looted = true;
    }
  } else {
    console.log(
      `${ANSI.ltgrey}the ${ANSI.ltblue}${container.names[0]}${ANSI.ltgrey} has already been ransacked...${ANSI.reset}`
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
        console.log(
          `you are in ${ANSI.ltblue}${player.location.name}${ANSI.reset}`
        );
        if (nextLoc.atmos.type === "hazardous") {
          if (lastLoc.atmos.type === "safe") {
            console.log(`${ANSI.yellow}you do not feel safe here${ANSI.reset}`);
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
          console.log(`${ANSI.ltgreen}you feel safe again${ANSI.reset}`);
        }
      } else {
        console.log(
          `${ANSI.ltgrey}you can not travel this direction${ANSI.reset}`
        );
      }
    } else {
      console.log(`${ANSI.ltgrey}that is not a valid direction${ANSI.reset}`);
    }
  } else {
    console.log(`${ANSI.ltred}you cannot escape this enemy${ANSI.reset}`);
  }
}
function diceRoll(chance) {
  let rand = Math.random() * 100;
  if (rand < chance) {
    return true;
  }
}

function spawnEnemy() {
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
    `you have encountered a ${ANSI.red}${
      enemies.find((x) => x.id === player.engaged[0][0]).name
    }${ANSI.reset}`
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
      console.log(`you equipped ${ANSI.green}${name}${ANSI.reset}`);
      player.damage = item.damage;
    } else {
      console.log(`you cannot equip ${ANSI.green}${name}${ANSI.reset}`);
    }
  } else {
    console.log(
      `${ANSI.ltgrey}please specify what you would like to equip${ANSI.reset}`
    );
  }
}

let dealtDamage = 0;

function attack(id) {
  // console.log(id);
  if (id > -1) {
    let curEnemy = enemies.find((x) => x.id === id);
    console.log(`you attacked ${ANSI.red}${curEnemy.name}${ANSI.reset}`);
    console.log(`you dealt ${ANSI.red}${player.damage}${ANSI.reset} damage`);
    dealtDamage += player.damage;
    if (dealtDamage >= curEnemy.hp) {
      console.log(
        `${ANSI.ltgreen}you defeated the ${ANSI.red}${curEnemy.name}${ANSI.reset}`
      );
      curEnemy.loot.forEach((item) => {
        if (diceRoll(item[2])) {
          addItem([item[0], item[1]]);
        }
      });
      player.engaged.pop();
      dealtDamage = 0;
    }
  } else {
    console.log(`${ANSI.ltgrey}there is nothing to attack${ANSI.reset}`);
  }
}

exports.commands = commands;
