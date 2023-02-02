const locations = {
  home: {
    name: "your humble aboad",
    desc: "a large empty room with brown walls. There is a worn dresser in the corner and a rubbish bin by the door.",
    type: "indoor",
    atmos: "safe",
    containers: [
      {
        names: ["dresser", "wardrobe"],
        desc: "a sturdy oak dresser carved with intricate trim depicting ships sailing the seas",
        items: [0, 1],
      },
      {
        names: ["bin", "rubbish", "trash", "trashcan"],
        desc: "a dusty pale with made from ancient wood that compare to dried out driftwood",
        items: [],
      },
    ],
  },
};

exports.locations = locations;
