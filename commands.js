const { player } = require("./player");
const { items } = require("./items");
const { locations } = require("./locations");
const { enemies } = require("./enemies");
const { ANSI } = require("./config");
const { npcs } = require("./npcs");
const { it } = require("node:test");
// const { resolve } = require("path");
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
    text: ["$go"],
    desc: "",
    type: "action",
    hidden: true,
    f: adminTravel,
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
    text: ["chat", "talk"],
    desc: "talk to NPC",
    type: "action",
    hidden: false,
    f: talk,
  },
  {
    text: ["wares", "sale"],
    desc: "see a merchant's wares",
    type: "action",
    hidden: false,
    f: printStore,
  },
  {
    text: ["buy", "purchase"],
    desc: "buy a specified item",
    type: "action",
    hidden: false,
    f: buy,
  },
  {
    text: ["sell"],
    desc: "sell an item to an NPC",
    type: "action",
    hidden: false,
    f: sell,
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

async function adminTravel(loc) {
  // console.log(loc);
  if (loc) {
    console.log(`${ANSI.ltmagenta}going to ${loc.name}${ANSI.reset}`);
    player.location = loc;
  }
}

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
async function talk() {
  console.log("u talk");
}
function checkForNPC(type) {
  let canSell = false;
  let id = -1;
  if (player.location.atmos.npcs != undefined) {
    player.location.atmos.npcs.forEach((npc) => {
      let mappedNPC = npcs.find((x) => x.id == npc[0]);
      console.log(mappedNPC);

      if (mappedNPC.jobs.includes(type)) {
        canSell = true;
        id = mappedNPC.id;
      }
    });
  }
  return { canSell, id };
}

async function sell(item) {
  if (checkInventory(item)) {
    let merchantInfo = checkForNPC("merchant");
    // console.log(merchantInfo);
    if (merchantInfo.canSell) {
      player.coins += item.value;
      removeItem(item, 1);
      let merchant = npcs.find((x) => (x.id = merchantInfo.id));
      // merchant.inventory
      // addItem(item, 1, merchant.inventory);
      addItem([item.id, 1], merchant.inventory);
      console.log(
        `you sold ${ANSI.ltgreen}${item.name}${ANSI.reset} for ${ANSI.yellow}${
          item.value
        }${ANSI.reset} ${item.value != 1 ? "coins" : "coin"}`
      );
    } else {
      console.log(
        `${ANSI.ltgrey}specifify what you would like to sell${ANSI.reset}`
      );
    }
  }
}
async function buy(item) {
  if (item) {
    let merchantInfo = checkForNPC("merchant");
    let inv = npcs.find((x) => x.id == merchantInfo.id).inventory;
    if (checkInventory(item, inv)) {
      for (let invItem of inv) {
        if (invItem[0] == item.id) {
          if (player.coins >= item.value) {
            addItem([item.id, 1], player.inventory, true);
            removeItem(item, 1, inv);
            player.coins -= item.value;
          } else {
            console.log(
              `${ANSI.ltgrey}you do not have enough coins${ANSI.reset}`
            );
          }
        }
      }
    }
  } else {
    console.log(
      `${ANSI.ltgrey}specify what you would likte to purchase${ANSI.reset}`
    );
  }
}
async function printStore() {
  let id = checkForNPC("merchant").id;
  // console.log(id);
  if (id != -1) {
    let npc = npcs.find((x) => x.id == id);
    printInv(npc.inventory);
  } else {
    console.log(`${ANSI.ltgrey}there is no merchant here${ANSI.reset}`);
  }
}

async function printInv(inv = player.inventory) {
  let lines = "";
  if (inv.length > 0) {
    for (let item of inv) {
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
  coins = centerText("Coins: " + player.coins, 41);
  let hp = player.hp.toString().padEnd(20, " ");
  let w = "";
  let def = centerText("Defense: " + player.defense, 41);
  let lvl = centerText("Level: " + player.level[0], 41);
  // let dmg = centerText(player.damage.toString(), 19);
  let dmg = centerText("Damage: " + player.damage, 19);
  if (player.equippedWeapon == -1) {
    w = "fists"; //.padEnd(17, " ");
  } else {
    w = items.find((x) => x.id == player.equippedWeapon).name; //.padEnd(17, " ");
  }
  w = centerText(w, 19);

  console.log(`
  ┌───────────────────┬─────────────────────────────────────────┐
  │  Current Weapon:  │                 HP: ${ANSI.ltgreen}${hp}${ANSI.reset}│
  │${ANSI.green}${w}${ANSI.reset}│${def}│
  │${ANSI.yellow}${dmg}${ANSI.reset}│${lvl}│
  │                   │${coins}│
  └───────────────────┴─────────────────────────────────────────┘
  
  `);
}
/////////////////////
async function silly(action) {
  console.log(`you ${action}`);
}
/////////////////////
function checkInventory(item, inv = player.inventory) {
  if (item) {
    let mapped = inv.find((x) => x[0] == item.id);
    if (mapped) {
      // console.log(mapped);
      return true;
    } else {
      return false;
    }
  }
}
async function addItem(item, inv = player.inventory, didBuy = false) {
  console.log(inv);
  let mappedItem = items.find((x) => x.id === item[0]);
  let isAdded = false;
  if (didBuy) {
    console.log(
      `you bought ${ANSI.green}${item[1]} ${mappedItem.name}${ANSI.reset}`
    );
  } else {
    console.log(
      `you found ${ANSI.green}${item[1]} ${mappedItem.name}${ANSI.reset}`
    );
  }

  if (inv.length > 0) {
    inv.forEach((ownedItem) => {
      if (ownedItem[0] === item[0]) {
        ownedItem[1] += item[1];
        isAdded = true;
      }
    });
  }
  if (!isAdded) {
    inv.push(item);
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
              diceRoll(30) && spawnEnemy();
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
}
async function spawnLocalEnemy() {}
async function updateDefense() {
  let newDefense = 0;
  for (const [key, value] of Object.entries(player.armor)) {
    // console.log(`${key}: ${value}`);
    if (value != -1) {
      newDefense += items.find((x) => x.id == value).defense;
    }
  }

  player.defense = newDefense;
}
async function equipArmor(item) {
  if (item.subtype == "helmet") {
    player.armor.helmet = item.id;
  } else if (item.subtype == "chest") {
    player.armor.chest = item.id;
  } else if (item.subtype == "legs") {
    player.armor.legs = item.id;
  } else if (item.subtype == "feet") {
    player.armor.feet = item.id;
  }
  updateDefense();
}

async function equip(item) {
  if (checkInventory(item)) {
    if (item.type == "weapon") {
      player.equippedWeapon = item.id;
      console.log(`you equipped ${ANSI.green}${item.name}${ANSI.reset}`);
      player.damage = item.damage;
    } else if (item.type == "armor") {
      console.log(`you equipped ${ANSI.green}${item.name}${ANSI.reset}`);
      equipArmor(item);
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
      await delay(1500).then(() => {
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

        addXP(curEnemy.xp);
        player.engaged.pop();
        dealtDamage = 0;
      });
    } else {
      await delay(1500).then(() => enemyAttack(curEnemy));
    }
  } else {
    console.log(`${ANSI.ltgrey}there is nothing to attack${ANSI.reset}`);
  }
}

async function addXP(xpToAdd) {
  let levelsGained = 0;
  player.level[1] += xpToAdd;
  while (player.level[1] >= 100) {
    player.level[1] -= 100;
    player.level[0] += 1;
    levelsGained++;
  }
  console.log(`gained ${ANSI.ltgreen}${xpToAdd} xp${ANSI.reset}`);
  // await delay(500).then(() => {
  if (levelsGained > 0) {
    console.log(
      `${ANSI.cyan}you have reached level ${ANSI.yellow}${player.level[0]}${ANSI.reset}`
    );
  }
  // });
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
    let calcDamage = thisAttack.damage - Math.round(player.defense / 5);
    await delay(1500).then(() => {
      player.hp -= calcDamage;

      console.log(
        `${ANSI.red}${enemy.name}${ANSI.reset} used ${ANSI.red}${thisAttack.name}${ANSI.reset}`
      );
    });

    await delay(1500).then(() => {
      if (player.hp < 0) {
        console.log(
          `you recieved ${ANSI.red}${calcDamage}${ANSI.reset} damage, your health is ${ANSI.ltred}0${ANSI.reset}`
        );
      } else {
        console.log(
          `you recieved ${ANSI.red}${calcDamage}${ANSI.reset} damage, your health is ${ANSI.ltgreen}${player.hp}${ANSI.reset}`
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

async function removeItem(item, quantity = 1, inv = player.inventory) {
  let itemToBeRemoved = inv.find((x) => x[0] == item.id);

  if (itemToBeRemoved[1] == quantity && inv == player.inventory) {
    if (itemToBeRemoved[0] == player.equippedWeapon) {
      player.equippedWeapon = -1;
      player.damage = 1;
    } else if (itemToBeRemoved[0] == player.armor.helmet) {
      player.armor.helmet = -1;
      updateDefense();
    } else if (itemToBeRemoved[0] == player.armor.chest) {
      player.armor.chest = -1;
      updateDefense();
    } else if (itemToBeRemoved[0] == player.armor.legs) {
      player.armor.legs = -1;
      updateDefense();
    } else if (itemToBeRemoved[0] == player.armor.feet) {
      player.armor.feet = -1;
      updateDefense();
    }
  }
  //
  if (itemToBeRemoved[1] > quantity) {
    itemToBeRemoved[1] -= quantity;
  } else {
    itemToBeRemoved[1] = 0;
    inv.splice(inv.indexOf(itemToBeRemoved), 1);
  }
}

async function eat(item) {
  if (item) {
    if (checkInventory(item)) {
      if (item.type == "food") {
        if (player.hp + item.hp > 100) {
          if (player.hp < 100) {
            console.log(
              `you ate ${ANSI.ltgreen}${item.name}${ANSI.reset}, you gained ${
                ANSI.ltgreen
              }${100 - player.hp}${ANSI.reset}hp`
            );
            player.hp = 100;
            removeItem(item, 1);
          } else {
            console.log(
              `${ANSI.ltgrey}you are too full to consume the ${ANSI.green}${item.name}${ANSI.reset}`
            );
          }
        } else {
          console.log(
            `you ate ${ANSI.ltgreen}${item.name}${ANSI.reset}, you gained ${ANSI.ltgreen}${item.hp}${ANSI.reset}hp`
          );
          player.hp += item.hp;
          removeItem(item, 1);
        }
      } else {
        console.log(
          `${ANSI.ltgrey}you can't eat ${ANSI.ltgreen}${item.name}${ANSI.reset}`
        );
      }
    } else {
      console.log(`${ANSI.ltgrey}what would you like to eat${ANSI.reset}`);
    }
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
