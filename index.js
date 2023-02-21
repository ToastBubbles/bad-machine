const { player } = require("./player");
const { locations } = require("./locations");
const { items } = require("./items");
const { commands } = require("./commands");
const { ANSI } = require("./config");
const fs = require("fs");
/**
 * TODO:
 *
 * allow multiple word items to be used
 *
 * factor in defense into combat
 *
 */
function load() {
  let rawdata = fs.readFileSync("save.json");
  let playerSave = JSON.parse(rawdata);
  // console.log(playerSave);
  // player = playerSave;

  player.hp = playerSave.hp;
  player.level = playerSave.level;
  player.equippedWeapon = playerSave.equippedWeapon;
  player.defense = playerSave.defense;
  player.coins = playerSave.coins;
  player.armor = playerSave.armor;
  player.damage = playerSave.damage;
  player.location = playerSave.location;
  player.engaged = playerSave.engaged;
  player.inventory = playerSave.inventory;
}

// function save() {
//   // fs.writeFile("save.json", content, (err) => {
//   //   if (err) {
//   //     console.error(err);
//   //   }
//   //   // file written successfully
//   // });
//   let data = JSON.stringify(player);
//   fs.writeFileSync("save.json", data);
// }

const cardDirections = [
  "north",
  "northwest",
  "west",
  "southwest",
  "south",
  "southeast",
  "east",
  "northeast",
];
function printSpecial(type) {
  switch (type) {
    case "line-single":
      return "------------------------------------";
    case "line-double":
      return "====================================";
    default:
      return "------------------------------------";
  }
}
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function start() {
  console.log(`${ANSI.yellow}`);
  console.log(printSpecial("line-double"));
  console.log("~~     welcome to bad machine.    ~~");
  console.log(printSpecial("line-double"));
  console.log(`${ANSI.reset}`);
}
function describeLocation(loc) {
  console.log(`You are in ${ANSI.ltblue}${loc.name}${ANSI.reset}.`);
}
function openPrompt(line = ">> ") {
  readline.question(line, (input) => {
    let i = 0;
    let functionHolder = null;
    let thisActionItem = null;
    let actionType = "";
    for (let cmd of commands) {
      let iArr = input.toLocaleLowerCase().split(" ");
      // for (let word of iArr) {
      iArr.forEach((word, index) => {
        if (cmd.text.includes(word)) {
          i++;
          if (
            cmd.type == "passive" ||
            cmd.type == "action" ||
            cmd.type == "silly" ||
            cmd.type == "attack"
          ) {
            functionHolder = cmd.f;
          }
          if (cmd.type === "silly") {
            thisActionItem = word;
          } else if (cmd.type === "attack") {
            if (player.engaged.length > 0) {
              // console.log(player.engaged[0][0]);
              thisActionItem = player.engaged[0][0];
            } else {
              //check if player is targetting npc
            }
          }
        }

        for (let container of player.location.containers) {
          if (container.names.includes(word)) {
            thisActionItem = container;
          }
          if (container.names.includes(word)) {
            thisActionItem = container;
          }
        }
        if (cardDirections.includes(word)) {
          thisActionItem = word;
        }
        for (let item of items) {
          if (item.name == word) {
            thisActionItem = item;
          }
          if (thisActionItem == null && index < iArr.length - 1) {
            // console.log("checking two word items");
            let multiWord = `${word} ${iArr[index + 1]}`;

            if (item.name == multiWord) {
              thisActionItem = item;
            }
          }
        }
        for (let location of locations) {
          if (location.name.toLowerCase() == word) {
            thisActionItem = location;
          }
          if (thisActionItem == null && index < iArr.length - 1) {
            // console.log("checking two word items");
            let multiWord = `${word} ${iArr[index + 1]}`;

            if (location.name == multiWord) {
              thisActionItem = location;
            } else {
              multiWord += ` ${iArr[index + 2]}`;
              if (location.name == multiWord) {
                thisActionItem = location;
              }
            }
          }
        }
        // for (let item of player.inventory) {
        //   let mapped = items.find((x) => x.id == item[0]);
        //   if (mapped.name == word) {
        //     thisActionItem = mapped;
        //   }
        //   if (thisActionItem == null && index < iArr.length - 1) {
        //     // console.log("checking two word items");
        //     let multiWord = `${word} ${iArr[index + 1]}`;

        //     if (mapped.name == multiWord) {
        //       thisActionItem = mapped;
        //     }
        //   }
        // }
      }); //
    }
    if (i == 0) {
      console.log(`I don't know the command: ${input}`);
      openPrompt();
    } else if (thisActionItem != null) {
      functionHolder(thisActionItem).then(() => {
        // openPrompt();
        if (player.hp <= 0) {
          readline.close();
        } else {
          openPrompt();
        }
      });
    } else {
      functionHolder().then(() => {
        if (player.hp <= 0) {
          readline.close();
        } else {
          openPrompt();
        }
        // openPrompt();
      });
    }
    // if (player.hp <= 0) {
    //   readline.close();
    // } else {
    //   openPrompt();
    // }
  });
}

function promptUser(q) {
  readline.question(q, (input) => {
    if (input.toUpperCase() === "Y") {
      console.log("Starting New Game...");
      setTimeout(() => {
        console.log(printSpecial("line-single"));

        describeLocation(player.location);
        openPrompt();
      }, 700);

      //   readline.close();
    } else {
      console.log("Loading Game...");
      load();
      setTimeout(() => {
        console.log(printSpecial("line-single"));

        describeLocation(player.location);
        openPrompt();
      }, 700);
    }
  });
}
start();
promptUser(`${ANSI.ltyellow}New game? Y/N ${ANSI.reset}`);
