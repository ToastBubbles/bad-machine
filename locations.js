let locations = [
  {
    name: "your humble aboad",
    desc: "a large empty room with brown walls. There is a worn dresser in the corner and a rubbish bin by the door.",
    coords: [0, 0],
    type: "indoor",
    atmos: { type: "safe" },
    containers: [
      {
        names: ["dresser", "wardrobe"],
        desc: "a sturdy oak dresser carved with intricate trim depicting little ships sailing the seas",
        items: [
          [0, 2],
          [1, 3],
          [4, 1],
          [9, 1],
          [10, 1],
          [11, 1],
          [12, 1],
        ],
      },
      {
        names: ["bin", "rubbish", "trash", "trashcan", "pale"],
        desc: "a dusty pale with made from ancient wood that is similar to dried out driftwood",
        items: [],
      },
    ],
  },
  {
    name: "your frontyard",
    desc: "a scruffy, half-acre field encapsulated in a shaggy wooden fence, the grass is soft but slightly unkept. there is a cobble pathway from the front door to an openning in the fence to the east which is guarded by a loose swinging gate and a small tin mailbox.",
    coords: [1, 0],
    type: "outdoor",
    atmos: { type: "safe" },
    containers: [
      {
        names: ["mail", "mailbox", "postbox"],
        desc: "a tin mailbox with a ribbed body and a rusty undercarrage",
        items: [
          [0, 4],
          [2, 1],
          [1, 12],
        ],
      },
      {
        names: ["rock"],
        desc: "a suspicious looking rock",
        items: [
          [3, 1],
          [8, 1],
        ],
      },
    ],
  },
  {
    name: "a lovely meadow",
    desc: "a wide open field of lush grash with a mix of lovely lilacs. You are standing on a winding cobble path that leads Northeast",
    coords: [2, 0],
    type: "outdoor",
    atmos: {
      type: "hazardous",
      level: 1,
      randEnemies: false,
    },
    containers: [],
  },
  {
    name: "a fork in the road",
    desc: "a strudy oak sign splits the path in two. the sign has one arrow-shaped plank pointing North that states 'Invinhall' while another points Southeast with the enscription 'Drothyl'",
    coords: [3, 1],
    type: "outdoor",
    atmos: {
      type: "hazardous",
      level: 1,
      randEnemies: false,
      enemies: [[0, 1]],
    },
    containers: [],
  },
  {
    name: "Invinhall",
    desc: "There is a shop to the northeast",
    coords: [3, 2],
    type: "outdoor",
    atmos: {
      type: "safe",
    },
    containers: [],
  },
  {
    name: "Invinhall shopkeep",
    desc: "buy and sell here",
    coords: [4, 3],
    type: "indoor",
    atmos: {
      type: "safe",
      npcs: [[100, 1]],
    },
    containers: [],
  },
];

exports.locations = locations;
