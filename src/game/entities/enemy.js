class Enemy {
  constructor(config) {
    this.type = config.type;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width || 32;
    this.height = config.height || 32;
    this.direction = config.direction || 1;
    this.speed = config.speed || 100;
    this.hp = config.hp || 1;
    this.patrolMinX = config.patrolMinX ?? this.x - 100;
    this.patrolMaxX = config.patrolMaxX ?? this.x + 100;
    this.chaseRange = config.chaseRange || 220;
    this.shootCooldown = config.shootCooldown || 2.0;
    this.shootTimer = config.shootCooldown || 2.0;
  }
}

class Boss {
  constructor(config) {
    this.type = config.type;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width || 80;
    this.height = config.height || 48;
    this.direction = 1;
    this.speed = config.speed || 80;
    this.patrolMinX = config.patrolMinX ?? this.x - 100;
    this.patrolMaxX = config.patrolMaxX ?? this.x + 100;
    this.hp = config.hp || 10;
    this.maxHp = config.hp || 10;
    this.attackCooldown = config.attackCooldown || config.shotCooldown || 1.8;
    this.attackTimer = this.attackCooldown;
    this.shotCooldown = config.shotCooldown || 1.8;
    this.summonCooldown = config.summonCooldown || 6.0;
    this.summonTimer = this.summonCooldown;
  }
}

export function createEnemiesFromLevel(enemyConfigs = []) {
  return enemyConfigs.map((config) => new Enemy(config));
}

export function createBossFromLevel(bossConfig) {
  if (!bossConfig) return null;
  return new Boss(bossConfig);
}

export { Enemy, Boss };
