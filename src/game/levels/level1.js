const level1 = {
  id: 1,
  name: "Village",
  worldWidth: 2600,
  spawn: { x: 90, y: 560 },
  platforms: [
    { x: 0, y: 640, width: 520, height: 80 },
    { x: 620, y: 640, width: 460, height: 80 },
    { x: 1160, y: 640, width: 480, height: 80 },
    { x: 1720, y: 640, width: 520, height: 80 },
    { x: 2320, y: 640, width: 280, height: 80 },
    { x: 220, y: 565, width: 170, height: 24 },
    { x: 520, y: 520, width: 170, height: 24 },
    { x: 820, y: 470, width: 170, height: 24 },
    { x: 1320, y: 545, width: 170, height: 24 },
    { x: 1600, y: 500, width: 150, height: 24 },
    { x: 1910, y: 455, width: 170, height: 24 },
    { x: 2140, y: 510, width: 130, height: 24 }
  ],
  hazards: [
    { x: 520, y: 640, width: 100, height: 80 },
    { x: 1080, y: 640, width: 80, height: 80 },
    { x: 1640, y: 640, width: 80, height: 80 },
    { x: 2240, y: 640, width: 80, height: 80 }
  ],
  enemies: [
    { type: "roamer", x: 470, y: 600, patrolMinX: 430, patrolMaxX: 640, speed: 95, hp: 1 },
    { type: "roamer", x: 780, y: 600, patrolMinX: 740, patrolMaxX: 970, speed: 105, hp: 1 },
    { type: "roamer", x: 1460, y: 600, patrolMinX: 1240, patrolMaxX: 1600, speed: 110, hp: 1 },
    { type: "roamer", x: 1980, y: 600, patrolMinX: 1780, patrolMaxX: 2200, speed: 108, hp: 1 }
  ],
  pickups: [
    { type: "spiritBloom", x: 820, y: 430, collected: false },
    { type: "moonBlade", x: 1940, y: 415, collected: false }
  ],
  boss: {
    type: "villageWarden",
    x: 2420,
    y: 600,
    width: 70,
    height: 42,
    patrolMinX: 2330,
    patrolMaxX: 2520,
    speed: 90,
    hp: 5
  },
  exit: { x: 2540, y: 598, width: 48, height: 52 }
};

export default level1;
