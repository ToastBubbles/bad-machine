const { player } = require("./player");
const { items } = require("./items");
const { locations } = require("./locations");
const { enemies } = require("./enemies");
const { ANSI } = require("./config");
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

function help() {
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
  if (chance == undefined) {
    return rand;
  } else {
    if (rand < chance) {
      return true;
    }
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

function equip(item) {
  // console.log(item);
  if (item) {
    // let item = items.find((x) => x.id == invItem[0]);
    // console.log(item);
    if (item.type == "sword") {
      player.equippedWeapon = item.id;
      console.log(`you equipped ${ANSI.green}${item.name}${ANSI.reset}`);
      player.damage = item.damage;
    } else {
      console.log(`you cannot equip ${ANSI.green}${item.name}${ANSI.reset}`);
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
    console.log(
      `you dealt ${ANSI.ltyellow}${player.damage}${ANSI.reset} damage`
    );
    dealtDamage += player.damage;
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
      enemyAttack(curEnemy);
    }
  } else {
    console.log(`${ANSI.ltgrey}there is nothing to attack${ANSI.reset}`);
  }
}

function enemyAttack(enemy) {
  // enemy;
  let attacked = false;
  let roll = diceRoll();
  let curChance = 0;
  // console.log(roll);
  enemy.attacks.forEach((attack) => {
    curChance += attack.chance;

    if (roll < curChance && !attacked) {
      attacked = true;
      player.hp -= attack.damage;

      console.log(
        `${ANSI.red}${enemy.name}${ANSI.reset} used ${ANSI.red}${attack.name}${ANSI.reset}`
      );
      console.log(
        `you recieved ${ANSI.red}${attack.damage}${ANSI.reset} damage, your health is ${ANSI.ltgreen}${player.hp}${ANSI.reset}`
      );
      if (player.hp <= 0) {
        die();
      }
    }
  });
}
function removeItem(item, quantity) {
  player.inventory.find((x) => x.id == item[0]);
}
function eat(item) {
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

function die() {
  // console.log(`${ANSI.ltred}you have died${ANSI.reset}`);
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
  // dead = true;
  // readline.close();
}

exports.commands = commands;
