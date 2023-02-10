const enemies = [
  {
    id: 0,
    name: "rat",
    level: 1,
    hp: 20,
    attacks: [
      {
        name: "bite",
        damage: 13,
        chance: 80,
      },
      {
        name: "tail whip",
        damage: 26,
        chance: 20,
      },
    ],
    loot: [
      [0, 1, 75],
      [7, 1, 15],
    ],
  },
  {
    id: 1,
    name: "beetle",
    level: 1,
    hp: 35,
    attacks: [
      {
        name: "bite",
        damage: 26,
        chance: 80,
      },
      {
        name: "crawl",
        damage: 46,
        chance: 19.5,
      },
      {
        name: "slurp",
        damage: 999999,
        chance: 0.5,
      },
    ],
    loot: [
      [5, 1, 20],
      [6, 1, 20],
    ],
  },
];

exports.enemies = enemies;
