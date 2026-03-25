const level3 = {
  id: 3,
  name: "Mansion",
  worldWidth: 4140,
  spawn: { x: 90, y: 560 },
  platforms: [
    { x: 0, y: 640, width: 420, height: 80 },
    { x: 500, y: 640, width: 370, height: 80 },
    { x: 950, y: 640, width: 360, height: 80 },
    { x: 1390, y: 640, width: 420, height: 80 },
    { x: 1890, y: 640, width: 390, height: 80 },
    { x: 2360, y: 640, width: 400, height: 80 },
    { x: 2840, y: 640, width: 390, height: 80 },
    { x: 3310, y: 640, width: 360, height: 80 },
    { x: 3750, y: 640, width: 390, height: 80 },
    { x: 230, y: 565, width: 150, height: 32 },
    { x: 520, y: 520, width: 170, height: 32 },
    { x: 820, y: 470, width: 170, height: 32 },
    { x: 1170, y: 420, width: 170, height: 32 },
    { x: 1520, y: 545, width: 170, height: 32 },
    { x: 1870, y: 500, width: 150, height: 32 },
    { x: 2240, y: 455, width: 170, height: 32 },
    { x: 2620, y: 510, width: 150, height: 32 },
    { x: 3010, y: 470, width: 170, height: 32 },
    { x: 3390, y: 520, width: 170, height: 32 }
  ],
  hazards: [
    { x: 420, y: 640, width: 80, height: 80 },
    { x: 870, y: 640, width: 80, height: 80 },
    { x: 1310, y: 640, width: 80, height: 80 },
    { x: 1810, y: 640, width: 80, height: 80 },
    { x: 2280, y: 640, width: 80, height: 80 },
    { x: 2760, y: 640, width: 80, height: 80 },
    { x: 3230, y: 640, width: 80, height: 80 },
    { x: 3670, y: 640, width: 80, height: 80 }
  ],
  enemies: [
    { type: "roamer", x: 340, y: 600, patrolMinX: 220, patrolMaxX: 470, speed: 102, hp: 1 },
    { type: "chaser", x: 690, y: 600, chaseRange: 250, speed: 118, hp: 2 },
    { type: "flyer", x: 980, y: 330, patrolMinX: 860, patrolMaxX: 1260, speed: 84, hp: 2, shootCooldown: 2.3 },
    { type: "roamer", x: 1630, y: 600, patrolMinX: 1430, patrolMaxX: 1790, speed: 108, hp: 1 },
    { type: "chaser", x: 2140, y: 600, chaseRange: 260, speed: 120, hp: 2 },
    { type: "flyer", x: 3090, y: 350, patrolMinX: 2920, patrolMaxX: 3470, speed: 88, hp: 2, shootCooldown: 2.2 }
  ],
  pickups: [
    { type: "spiritBloom", x: 610, y: 480, collected: false },
    { type: "moonBlade", x: 1940, y: 460, collected: false },
    { type: "orbSigil", x: 2680, y: 480, collected: false }
  ],
  boss: {
    type: "bathhouseMatron",
    x: 3880,
    y: 590,
    width: 80,
    height: 50,
    patrolMinX: 3790,
    patrolMaxX: 4060,
    chaseRange: 260,
    speed: 78,
    hp: 10,
    shotCooldown: 2.2
  },
  exit: { x: 4070, y: 598, width: 48, height: 52 }
};

export default level3;
