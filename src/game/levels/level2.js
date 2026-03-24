const level2 = {
  id: 2,
  name: "Forest",
  worldWidth: 3860,
  spawn: { x: 90, y: 560 },
  platforms: [
    { x: 0, y: 640, width: 420, height: 80 },
    { x: 500, y: 640, width: 390, height: 80 },
    { x: 970, y: 640, width: 410, height: 80 },
    { x: 1460, y: 640, width: 430, height: 80 },
    { x: 1970, y: 640, width: 400, height: 80 },
    { x: 2450, y: 640, width: 390, height: 80 },
    { x: 2920, y: 640, width: 360, height: 80 },
    { x: 3360, y: 640, width: 500, height: 80 },
    { x: 220, y: 565, width: 170, height: 32 },
    { x: 540, y: 520, width: 170, height: 32 },
    { x: 860, y: 470, width: 170, height: 32 },
    { x: 1290, y: 545, width: 170, height: 32 },
    { x: 1620, y: 500, width: 150, height: 32 },
    { x: 2020, y: 455, width: 170, height: 32 },
    { x: 2390, y: 510, width: 140, height: 32 },
    { x: 2790, y: 470, width: 170, height: 32 },
    { x: 3160, y: 520, width: 170, height: 32 }
  ],
  hazards: [
    { x: 420, y: 640, width: 80, height: 80 },
    { x: 890, y: 640, width: 80, height: 80 },
    { x: 1380, y: 640, width: 80, height: 80 },
    { x: 1890, y: 640, width: 80, height: 80 },
    { x: 2370, y: 640, width: 80, height: 80 },
    { x: 2840, y: 640, width: 80, height: 80 },
    { x: 3280, y: 640, width: 80, height: 80 }
  ],
  enemies: [
    { type: "roamer", x: 360, y: 600, patrolMinX: 220, patrolMaxX: 470, speed: 100, hp: 1 },
    { type: "chaser", x: 720, y: 600, chaseRange: 280, speed: 122, hp: 2 },
    { type: "chaser", x: 1130, y: 600, chaseRange: 250, speed: 120, hp: 2 },
    { type: "roamer", x: 1700, y: 600, patrolMinX: 1510, patrolMaxX: 1870, speed: 110, hp: 1 },
    { type: "chaser", x: 2120, y: 600, chaseRange: 310, speed: 126, hp: 2 },
    { type: "roamer", x: 2730, y: 600, patrolMinX: 2490, patrolMaxX: 2820, speed: 112, hp: 1 },
    { type: "chaser", x: 3150, y: 600, chaseRange: 300, speed: 128, hp: 2 }
  ],
  pickups: [
    { type: "spiritBloom", x: 860, y: 430, collected: false },
    { type: "moonBlade", x: 2020, y: 415, collected: false },
    { type: "spiritBloom", x: 3170, y: 480, collected: false }
  ],
  boss: {
    type: "forestRonin",
    x: 3560,
    y: 596,
    width: 74,
    height: 44,
    patrolMinX: 3440,
    patrolMaxX: 3780,
    chaseRange: 320,
    speed: 128,
    hp: 8,
    attackCooldown: 1.15
  },
  exit: { x: 3790, y: 598, width: 48, height: 52 }
};

export default level2;
