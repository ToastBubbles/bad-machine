const { player } = require("./player");
const { items } = require("./items");
const { locations } = require("./locations");
const { enemies } = require("./enemies");
const { ANSI } = require("./config");
const { resolve } = require("path");
// let dead = false;
// const { randomBytes } = require("crypto");

let commands = [
  {
    text: ["help", "commands"],
    desc: "list commands",
    type: "action",
    hidden: false,
    f: help,
  },
  {
    text: ["stats"],
    desc: "print player stats",
    type: "action",
    hidden: false,
    f: printStats,
  },
  {
    text: ["where", "describe", "location", "look", "inspect"],
    desc: "describe location or object",
    type: "action",
    hidden: false,
    f: describeLoc,
  },
  {
    text: ["loot", "search", "open", "take"],
    desc: "loot a specified container",
    type: "action",
    hidden: false,
    f: loot,
  },
  {
    text: ["go", "move", "travel"],
    desc: "go in a specified direction",
    type: "action",
    hidden: false,
    f: go,
  },
  {
    text: ["inventory", "backpack", "inv"],
    desc: "view inventory",
    type: "action",
    hidden: false,
    f: printInv,
  },
  {
    text: ["attack"],
    desc: "attack",
    type: "attack",
    hidden: false,
    f: attack,
  },
  {
    text: ["equip"],
    desc: "equip an item",
    type: "action",
    hidden: false,
    f: equip,
  },
  {
    text: ["eat", "enjoy", "consume", "drink", "sip"],
    desc: "consume a food item",
    type: "action",
    hidden: false,
    f: eat,
  },
  {
    text: ["die"],
    desc: "uhh",
    type: "action",
    hidden: true,
    f: die,
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
    hidden: true,
    f: silly,
  },
];

async function help() {
  console.log("commands:");
  for (let command of commands) {
    if (!command.hidden) {
      console.log(
        `use || ${command.text.join("  ").padEnd(75, ".")} || to ${
          command.desc
        }`
      );
    }
  }
}
///////////////////////////////////////////
async function describeLoc(item = player.location) {
  console.log(item.desc);
}
///////////////////
// async function printInv() {
//   if (player.inventory.length > 0) {
//     for (let item of player.inventory) {
//       let mappedItem = items.find((x) => x.id === item[0]);

//       console.log(
//         `you have ${ANSI.green}${item[1]} ${ANSI.green}${mappedItem.name}${ANSI.reset}`
//       );
//     }
//   } else {
//     console.log(
//       "you have a legendary beskar steel sword and 1,230,420 gold coins"
//     );
//     // setTimeout(() => {
//     console.log(`${ANSI.ltgrey}lol jk, u aint got shit${ANSI.reset}`);
//     // }, 1500);
//   }
// }
async function printInv() {
  let lines = "";
  if (player.inventory.length > 0) {
    for (let item of player.inventory) {
      let mappedItem = items.find((x) => x.id === item[0]);
      lines += `\n  │${mappedItem.name.padEnd(39, " ")}│${item[1]
        .toString()
        .padStart(10, " ")}│${mappedItem.value.toString().padStart(8, " ")} C│`;
      // console.log(
      //   `you have ${ANSI.green}${item[1]} ${ANSI.green}${mappedItem.name}${ANSI.reset}`
      // );
    }
  }

  console.log(
    `
  ┌───────────────────────────────────────┬──────────┬──────────┐
  │      Item:                            │  Qty:    │  Price:  │
  ├───────────────────────────────────────┼──────────┼──────────┤${lines}
  └───────────────────────────────────────┴──────────┴──────────┘
`
  );

  // if (player.inventory.length > 0) {
  //   for (let item of player.inventory) {
  //     let mappedItem = items.find((x) => x.id === item[0]);

  //     console.log(
  //       `you have ${ANSI.green}${item[1]} ${ANSI.green}${mappedItem.name}${ANSI.reset}`
  //     );
  //   }
  // } else {
  //   console.log(
  //     "you have a legendary beskar steel sword and 1,230,420 gold coins"
  //   );
  //   // setTimeout(() => {
  //   console.log(`${ANSI.ltgrey}lol jk, u aint got shit${ANSI.reset}`);
  //   // }, 1500);
  // }
}
function centerText(str, totalSpace) {
  let i = 0;

  let space = totalSpace - str.length;
  if (space % 2 == 0) {
    while (i < space / 2) {
      str = " " + str + " ";
      i++;
    }
  } else {
    while (i < space / 2 - 1) {
      str = " " + str + " ";
      i++;
    }
    str = str + " ";
  }
  return str;
}

async function printStats() {
  let hp = player.hp.toString().padEnd(22, " ");
  let w = "";
  // let dmg = centerText(player.damage.toString(), 19);
  let dmg = centerText("Damage: " + player.damage, 19);
  if (player.equippedWeapon == 0) {
    w = "fists"; //.padEnd(17, " ");
  } else {
    w = items.find((x) => x.id == player.equippedWeapon).name; //.padEnd(17, " ");
  }
  w = centerText(w, 19);

  console.log(`
  ┌───────────────────┬─────────────────────────────────────────┐
  │  Current Weapon:  │               HP: ${ANSI.ltgreen}${hp}${ANSI.reset}│
  │${ANSI.green}${w}${ANSI.reset}│                                         │
  │${ANSI.yellow}${dmg}${ANSI.reset}│                                         │
  └───────────────────┴─────────────────────────────────────────┘
  
  `);
}
/////////////////////
async function silly(action) {
  console.log(`you ${action}`);
}
/////////////////////

async function addItem(item) {
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
async function loot(container) {
  if (!container) {
    console.log(
      `${ANSI.ltgrey}specify what you would like to search${ANSI.reset}`
    );
  } else if (!container.looted) {
    console.log(`you looted ${ANSI.ltblue}${container.names[0]}${ANSI.reset}`);

    if (container.items.length > 0) {
      container.items.forEach((foundItem) => {
        addItem(foundItem);
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

async function go(dirLoc) {
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
async function diceRoll(chance) {
  let rand = Math.random() * 100;
  if (chance == undefined) {
    return rand;
  } else {
    if (rand < chance) {
      return true;
    }
  }
}

async function spawnEnemy() {
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
async function spawnLocalEnemy() {}

async function equip(item) {
  // console.log(item);
  if (item) {
    // let item = items.find((x) => x.id == invItem[0]);
    // console.log(item);
    if (item.type == "weapon") {
      player.equippedWeapon = item.id;
      console.log(`you equipped ${ANSI.green}${item.name}${ANSI.reset}`);
      player.damage = item.damage;
    } else if (item.name != undefined) {
      console.log(`you cannot equip ${ANSI.green}${item.name}${ANSI.reset}`);
    } else {
      console.log(
        `you cannot equip ${ANSI.green}${item.names[0]}${ANSI.reset}`
      );
    }
  } else {
    console.log(
      `${ANSI.ltgrey}please specify what you would like to equip${ANSI.reset}`
    );
  }
}

let dealtDamage = 0;

async function attack(id) {
  // console.log(id);
  if (id > -1) {
    let curEnemy = enemies.find((x) => x.id === id);
    console.log(`you attacked ${ANSI.red}${curEnemy.name}${ANSI.reset}`);
    await delay(1500).then(() => {
      console.log(
        `you dealt ${ANSI.ltyellow}${player.damage}${ANSI.reset} damage`
      );
      dealtDamage += player.damage;
    });

    if (dealtDamage >= curEnemy.hp) {
      console.log(
        `${ANSI.ltgreen}you defeated the ${ANSI.red}${curEnemy.name}${ANSI.reset}`
      );
      let addedLoot = 0;
      curEnemy.loot.forEach((item) => {
        if (diceRoll(item[2])) {
          addedLoot++;
          addItem([item[0], item[1]]);
        }
      });
      if (!addedLoot) {
        console.log(`${ANSI.ltgrey}you found nothing${ANSI.reset}`);
      }
      player.engaged.pop();
      dealtDamage = 0;
    } else {
      // setTimeout(() => {
      await delay(1500).then(() => enemyAttack(curEnemy));
      // }, 1500);
    }
  } else {
    console.log(`${ANSI.ltgrey}there is nothing to attack${ANSI.reset}`);
  }
}

async function enemyAttack(enemy) {
  let attacked = false;
  let roll = await diceRoll();
  let curChance = 0;
  let thisAttack = {};

  enemy.attacks.forEach((attack) => {
    curChance += attack.chance;

    if (roll < curChance && !attacked) {
      attacked = true;
      // console.log(attack);
      thisAttack = attack;
    }
  });
  if (attacked) {
    await delay(1500).then(() => {
      player.hp -= thisAttack.damage;

      console.log(
        `${ANSI.red}${enemy.name}${ANSI.reset} used ${ANSI.red}${thisAttack.name}${ANSI.reset}`
      );
    });

    await delay(1500).then(() => {
      if (player.hp < 0) {
        console.log(
          `you recieved ${ANSI.red}${thisAttack.damage}${ANSI.reset} damage, your health is ${ANSI.ltred}0${ANSI.reset}`
        );
      } else {
        console.log(
          `you recieved ${ANSI.red}${thisAttack.damage}${ANSI.reset} damage, your health is ${ANSI.ltgreen}${player.hp}${ANSI.reset}`
        );
      }

      if (player.hp <= 0) {
        die();
      }
    });
  }
}

async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
}
async function removeItem(item, quantity) {
  player.inventory.find((x) => x.id == item[0]);
}
async function eat(item) {
  if (item.type == "food") {
    console.log(
      `you ate ${ANSI.ltgreen}${item.name}${ANSI.reset}, you gained ${ANSI.ltgreen}${item.hp}${ANSI.reset}hp`
    );
    player.hp += item.hp;
  } else {
    console.log(
      `${ANSI.ltgrey}you can't eat ${ANSI.ltgreen}${item.name}${ANSI.reset}`
    );
  }
}

async function die() {
  // console.log(`${ANSI.ltred}you have died${ANSI.reset}`);
  await delay(500).then(() => {
    console.log(
      `${ANSI.ltred}
    _____    _____   ________     ____    ____       _________      ______   _________   _________
    \\    \\  /    /  /         \\  |    |  |    |     |          \\   |      | |     ____| |          \\
     \\    \\/    /  |     _     | |    |  |    |     |     _     \\   |    |  |    |___   |     _     \\
      \\        /   |    | |    | |    |  |    |     |    |  \\    |  |    |  |     ___|  |    |  \\    |
       \\      /    |    | |    | |    |  |    |     |    |  |    |  |    |  |    |      |    |  |    |
        |    |     |    '-'    | |    '--'    |     |    '--'    |  |    |  |    |____  |    '--'    |
        |    |      \\         /   \\          /      |           /  ,'    ', |         | |           / 
        '----'       '-------'     '--------'       '----------'   '------' '---------' '----------'
     ${ANSI.reset}`
    );
    player.hp = 0;
  });
  // dead = true;
  // readline.close();
}

exports.commands = commands;
