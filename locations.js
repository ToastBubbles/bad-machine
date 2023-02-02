const locations = [
  {
    name: "your humble aboad",
    desc: "a large empty room with brown walls. There is a worn dresser in the corner and a rubbish bin by the door.",
    coords: [0, 0],
    type: "indoor",
    atmos: "safe",
    containers: [
      {
        names: ["dresser", "wardrobe"],
        desc: "a sturdy oak dresser carved with intricate trim depicting little ships sailing the seas",
        items: [0, 1],
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
    atmos: "safe",
    containers: [
      {
        names: ["mail", "mailbox", "postbox"],
        desc: "a tin mailbox with a ribbed body and a rusty undercarrage",
        items: [2],
      },
      {
        names: ["rock"],
        desc: "a rock",
        items: [3],
      },
    ],
  },
];

exports.locations = locations;
