// import { locations } from "./locations";
// import { player } from "./player";

// let locations = require("./locations");
let player = require("./player");
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

let items = [
  {
    id: 0,
    type: "food",
    name: "cheese",
    value: 5,
  },
];
function start() {
  console.log(printSpecial("line-double"));
  console.log("~~     welcome to bad machine.    ~~");
  console.log(printSpecial("line-double"));
}
function describeLocation(loc) {
  console.log("You are in " + loc.name + ".");
}

function promptUser(q) {
  //   const prompt = require("prompt-sync")();
  //   const name = prompt(q);
  readline.question(q, (input) => {
    // console.log(`Hey there ${name}!`);
    if (input.toUpperCase() === "Y") {
      console.log("Starting New Game...");
      setTimeout(() => {
        console.log(printSpecial("line-single"));
        // console.log(player.player);
        describeLocation(player.player.location);
      }, 700);

      //   readline.close();
    } else {
    }
  });
}
start();
promptUser("New game? Y/N ");
