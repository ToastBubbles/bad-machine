const enemies = [
  {
    id: 0,
    name: "rat",
    level: 1,
    hp: 20,
    attacks: [
      {
        name: "bite",
        dmg: 2,
        chance: 80,
      },
      {
        name: "tail whip",
        dmg: 6,
        chance: 20,
      },
    ],
    loot: [[0, 1, 90]],
  },
  {
    id: 1,
    name: "beetle",
    level: 1,
    hp: 35,
    attacks: [
      {
        name: "bite",
        dmg: 2,
        chance: 80,
      },
      {
        name: "crawl",
        dmg: 3,
        chance: 20,
      },
    ],
    loot: [
      [1, 1, 90],
      [4, 2, 50],
    ],
  },
];

exports.enemies = enemies;
