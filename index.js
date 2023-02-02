const { player } = require("./player");
const { items } = require("./items");
const { commands } = require("./commands");
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
    let thisContainer = null;
    let actionType = "";
    for (let cmd of commands) {
      let iArr = input.split(" ");
      for (let word of iArr) {
        if (cmd.text.includes(word)) {
          i++;
          if (cmd.type == "passive" || cmd.type == "action") {
            functionHolder = cmd.f;
          }

          //cmd.f();
        }
        for (let container of player.location.containers) {
          // console.log(container.names);
          if (container.names.includes(word)) {
            //   console.log(thisContainer);
            thisContainer = container;
            actionType = "search";
          }
        }
      }
    }

    if (i == 0) {
      console.log(`I don't know the command: ${input}`);
    } else if (actionType == "search") {
      //   console.log(thisContainer);
      functionHolder(thisContainer);
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
    }
  });
}
start();
promptUser("New game? Y/N ");
