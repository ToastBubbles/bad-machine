const { ui } = require("./ui");
const { commands } = require("./commands");
async function printInv() {
  let lines = "";
  if (player.inventory.length > 0) {
    for (let item of player.inventory) {
      let mappedItem = items.find((x) => x.id === item[0]);
      lines += `\n  │${mappedItem.name.padEnd(39, " ")}│${item[1]
        .toString()
        .padStart(10, " ")}│${mappedItem.value.toString().padStart(8, " ")} C│`;
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

async function printStats() {
  let hp = player.hp.toString().padEnd(20, " ");
  let w = "";
  let def = centerText("Defense: " + player.defense, 41);
  let dmg = centerText("Damage: " + player.damage, 19);
  if (player.equippedWeapon == -1) {
    w = "fists";
  } else {
    w = items.find((x) => x.id == player.equippedWeapon).name;
  }
  w = centerText(w, 19);

  console.log(`
    ┌───────────────────┬─────────────────────────────────────────┐
    │  Current Weapon:  │                 HP: ${ANSI.ltgreen}${hp}${ANSI.reset}│
    │${ANSI.green}${w}${ANSI.reset}│                                         │
    │${ANSI.yellow}${dmg}${ANSI.reset}│${def}│
    └───────────────────┴─────────────────────────────────────────┘
    
    `);
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

exports.ui = {
  printInv,
  printStats,
};
