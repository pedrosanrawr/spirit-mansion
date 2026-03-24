const level3 = {
  id: 3,
  name: "Mansion",
  worldWidth: 3400,
  spawn: { x: 80, y: 560 },
  platforms: [
    { x: 0, y: 680, width: 320, height: 40 },
    { x: 400, y: 680, width: 260, height: 40 },
    { x: 730, y: 680, width: 240, height: 40 },
    { x: 1030, y: 680, width: 260, height: 40 },
    { x: 1360, y: 680, width: 300, height: 40 },
    { x: 1730, y: 680, width: 290, height: 40 },
    { x: 2080, y: 680, width: 260, height: 40 },
    { x: 2400, y: 680, width: 280, height: 40 },
    { x: 2750, y: 680, width: 280, height: 40 },
    { x: 3090, y: 680, width: 310, height: 40 },
    { x: 230, y: 560, width: 120, height: 24 },
    { x: 410, y: 500, width: 150, height: 24 },
    { x: 670, y: 450, width: 150, height: 24 },
    { x: 930, y: 390, width: 160, height: 24 },
    { x: 1420, y: 540, width: 150, height: 24 },
    { x: 1740, y: 490, width: 170, height: 24 },
    { x: 2120, y: 430, width: 170, height: 24 },
    { x: 2540, y: 500, width: 170, height: 24 },
    { x: 2860, y: 440, width: 170, height: 24 }
  ],
  hazards: [
    { x: 320, y: 680, width: 80, height: 50 },
    { x: 660, y: 680, width: 70, height: 50 },
    { x: 970, y: 680, width: 60, height: 50 },
    { x: 1290, y: 680, width: 70, height: 50 },
    { x: 1660, y: 680, width: 70, height: 50 },
    { x: 2020, y: 680, width: 60, height: 50 },
    { x: 2340, y: 680, width: 60, height: 50 },
    { x: 2680, y: 680, width: 70, height: 50 },
    { x: 3030, y: 680, width: 60, height: 50 }
  ],
  enemies: [
    { type: "roamer", x: 350, y: 640, patrolMinX: 320, patrolMaxX: 505, speed: 105, hp: 1 },
    { type: "chaser", x: 620, y: 640, chaseRange: 280, speed: 125, hp: 2 },
    { type: "flyer", x: 780, y: 330, patrolMinX: 650, patrolMaxX: 980, speed: 90, hp: 2, shootCooldown: 2.0 },
    { type: "roamer", x: 1520, y: 640, patrolMinX: 1390, patrolMaxX: 1640, speed: 110, hp: 1 },
    { type: "chaser", x: 2010, y: 640, chaseRange: 290, speed: 126, hp: 2 },
    { type: "flyer", x: 2590, y: 360, patrolMinX: 2460, patrolMaxX: 2960, speed: 95, hp: 2, shootCooldown: 1.8 }
  ],
  pickups: [
    { type: "spiritBloom", x: 430, y: 460, collected: false },
    { type: "moonBlade", x: 1760, y: 450, collected: false },
    { type: "orbSigil", x: 2860, y: 400, collected: false }
  ],
  boss: {
    type: "bathhouseMatron",
    x: 3190,
    y: 640,
    width: 80,
    height: 50,
    patrolMinX: 3120,
    patrolMaxX: 3330,
    speed: 85,
    hp: 12,
    shotCooldown: 1.8,
    summonCooldown: 6.5
  },
  exit: { x: 3340, y: 628, width: 48, height: 52 }
};

export default level3;
