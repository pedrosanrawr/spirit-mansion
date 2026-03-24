const level2 = {
  id: 2,
  name: "Forest",
  worldWidth: 3000,
  spawn: { x: 90, y: 560 },
  platforms: [
    { x: 0, y: 680, width: 380, height: 40 },
    { x: 460, y: 680, width: 360, height: 40 },
    { x: 900, y: 680, width: 370, height: 40 },
    { x: 1340, y: 680, width: 380, height: 40 },
    { x: 1810, y: 680, width: 400, height: 40 },
    { x: 2280, y: 680, width: 360, height: 40 },
    { x: 2690, y: 680, width: 310, height: 40 },
    { x: 220, y: 560, width: 150, height: 24 },
    { x: 500, y: 520, width: 180, height: 24 },
    { x: 820, y: 470, width: 170, height: 24 },
    { x: 1210, y: 540, width: 170, height: 24 },
    { x: 1560, y: 500, width: 180, height: 24 },
    { x: 1970, y: 455, width: 170, height: 24 },
    { x: 2370, y: 520, width: 160, height: 24 }
  ],
  hazards: [
    { x: 380, y: 680, width: 80, height: 50 },
    { x: 820, y: 680, width: 80, height: 50 },
    { x: 1270, y: 680, width: 70, height: 50 },
    { x: 1720, y: 680, width: 90, height: 50 },
    { x: 2210, y: 680, width: 70, height: 50 },
    { x: 2640, y: 680, width: 50, height: 50 }
  ],
  enemies: [
    { type: "roamer", x: 390, y: 640, patrolMinX: 360, patrolMaxX: 560, speed: 100, hp: 1 },
    { type: "chaser", x: 700, y: 640, chaseRange: 260, speed: 120, hp: 2 },
    { type: "chaser", x: 980, y: 640, chaseRange: 230, speed: 118, hp: 2 },
    { type: "roamer", x: 1500, y: 640, patrolMinX: 1380, patrolMaxX: 1690, speed: 110, hp: 1 },
    { type: "chaser", x: 2060, y: 640, chaseRange: 300, speed: 126, hp: 2 }
  ],
  pickups: [
    { type: "spiritBloom", x: 820, y: 430, collected: false },
    { type: "moonBlade", x: 1970, y: 415, collected: false }
  ],
  boss: {
    type: "forestRonin",
    x: 2790,
    y: 640,
    width: 74,
    height: 44,
    patrolMinX: 2700,
    patrolMaxX: 2930,
    speed: 110,
    hp: 8,
    attackCooldown: 1.5
  },
  exit: { x: 2940, y: 628, width: 48, height: 52 }
};

export default level2;
