const ENEMY_SIZES = {
  roamer: { width: 48, height: 48 },
  chaser: { width: 48, height: 48 },
  flyer: { width: 108, height: 108 }
};

const BOSS_SIZES = {
  villageWarden: { width: 138, height: 138 },
  forestRonin: { width: 138, height: 158 },
  bathhouseMatron: { width: 138, height: 158 }
};

class Enemy {
  constructor(config) {
    const defaultWidth = config.width || 32;
    const defaultHeight = config.height || 32;
    const size = ENEMY_SIZES[config.type] || {};
    const finalWidth = config.width || size.width || defaultWidth;
    const finalHeight = config.height || size.height || defaultHeight;

    this.type = config.type;
    this.x = config.x - (finalWidth - defaultWidth) / 2;
    this.y = config.y - (finalHeight - defaultHeight);
    this.width = finalWidth;
    this.height = finalHeight;
    this.direction = config.direction || 1;
    this.speed = config.speed || 100;
    this.hp = config.hp || 1;
    this.patrolMinX = config.patrolMinX ?? this.x - 100;
    this.patrolMaxX = config.patrolMaxX ?? this.x + 100;
    this.chaseRange = config.chaseRange || 220;
    this.shootCooldown = config.shootCooldown || 2.0;
    this.shootTimer = config.shootCooldown || 2.0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
  }
}

class Boss {
  constructor(config) {
    const defaultWidth = 80;
    const defaultHeight = 48;
    const configWidth = config.width || defaultWidth;
    const configHeight = config.height || defaultHeight;
    const size = BOSS_SIZES[config.type] || {};
    const finalWidth = size.width || configWidth;
    const finalHeight = size.height || configHeight;

    this.type = config.type;
    this.x = config.x - (finalWidth - configWidth) / 2;
    this.y = config.y - (finalHeight - configHeight);
    this.width = finalWidth;
    this.height = finalHeight;
    this.direction = 1;
    this.facing = 1;
    this.speed = config.speed || 80;
    this.patrolMinX = config.patrolMinX != null
      ? config.patrolMinX - (finalWidth - configWidth) / 2
      : this.x - 100;
    this.patrolMaxX = config.patrolMaxX != null
      ? config.patrolMaxX + (finalWidth - configWidth) / 2
      : this.x + finalWidth + 100;
    this.hp = config.hp || 10;
    this.maxHp = config.hp || 10;
    this.attackCooldown = config.attackCooldown || config.shotCooldown || 1.8;
    this.attackTimer = this.attackCooldown;
    this.attackAnimationTimer = 0;
    this.attackAnimationDuration = config.attackAnimationDuration || 0.45;
    this.attackRange = config.attackRange || 190;
    this.shotCooldown = config.shotCooldown || 1.8;
    this.summonCooldown = config.summonCooldown || 6.0;
    this.summonTimer = this.summonCooldown;
    this.chaseRange = config.chaseRange || 260;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
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
