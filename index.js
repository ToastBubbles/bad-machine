const { player } = require("./player");
const { items } = require("./items");
const { commands } = require("./commands");

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
  console.log(printSpecial("line-double"));
  console.log("~~     welcome to bad machine.    ~~");
  console.log(printSpecial("line-double"));
}
function describeLocation(loc) {
  console.log("You are in " + loc.name + ".");
}
function openPrompt(line = ": ") {
  readline.question(line, (input) => {
    let i = 0;
    let functionHolder = null;
    let thisActionItem = null;
    let actionType = "";
    for (let cmd of commands) {
      let iArr = input.toLocaleLowerCase().split(" ");
      for (let word of iArr) {
        if (cmd.text.includes(word)) {
          i++;
          if (
            cmd.type == "passive" ||
            cmd.type == "action" ||
            cmd.type == "silly"
          ) {
            functionHolder = cmd.f;
          }
          if (cmd.type === "silly") {
            thisActionItem = word;
          }

          //cmd.f();
        }

        // else
        // {
        for (let container of player.location.containers) {
          // console.log(container.names);
          if (container.names.includes(word)) {
            //   console.log(thisActionItem);
            thisActionItem = container;
            // actionType = "container";
          }
          if (container.names.includes(word)) {
            //   console.log(thisActionItem);
            thisActionItem = container;
            // actionType = "travel";
          }
        }
        if (cardDirections.includes(word)) {
          thisActionItem = word;
        }
        // }
      }
    }
    // console.log(functionHolder);
    if (i == 0) {
      console.log(`I don't know the command: ${input}`);
    } else if (thisActionItem != null) {
      //   console.log(thisActionItem);
      functionHolder(thisActionItem);
    } else {
      functionHolder();
    }
    openPrompt();
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
      openPrompt();
    }
  });
}
start();
promptUser("New game? Y/N ");
