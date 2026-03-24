import { GAME_CONSTANTS as C } from "./config/constants.js";
import level1 from "../levels/level1.js";
import level2 from "../levels/level2.js";
import level3 from "../levels/level3.js";
import Player from "../entities/player.js";
import { createEnemiesFromLevel, createBossFromLevel } from "../entities/enemy.js";
import { createPlatforms } from "../entities/platform.js";
import InputSystem from "../systems/input.js";
import Renderer from "../systems/renderer.js";
import AssetLoader from "../systems/assetloader.js";
import { clamp, overlaps, resolvePlatformCollision } from "../systems/physics.js";

const LEVEL_MAP = { 1: level1, 2: level2, 3: level3 };
const PICKUP_LABELS = {
  spiritBloom: "Spirit Bloom",
  moonBlade: "Moon Blade",
  orbSigil: "Orb Sigil"
};

class GameEngine {
  constructor(p, router) {
    this.p = p;
    this.router = router;
    this.fixedStep = C.fixedStep;
    this.accumulator = 0;
    this.levelId = 1;
    this.level = null;
    this.worldWidth = 1280;
    this.cameraX = 0;
    this.player = null;
    this.platforms = [];
    this.hazards = [];
    this.enemies = [];
    this.pickups = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.boss = null;
    this.exit = null;
    this.exitUnlocked = false;
    this.levelComplete = false;
    this.message = "";
    this.messageTimer = 0;

    this.input = new InputSystem(p, C);
    this.renderer = new Renderer(p);
    this.assetLoader = new AssetLoader(p);
    this.assets = this.assetLoader.getAssets();
    this.assetLoader.preloadCommonAssets().catch(() => {});
  }

  start(levelId = 1) {
    this.levelId = LEVEL_MAP[levelId] ? levelId : 1;
    this.level = JSON.parse(JSON.stringify(LEVEL_MAP[this.levelId]));
    this.worldWidth = this.level.worldWidth || this.p.width;
    this.cameraX = 0;
    this.accumulator = 0;
    this.levelComplete = false;
    this.exitUnlocked = false;

    this.platforms = createPlatforms(this.level.platforms || []);
    this.hazards = this.level.hazards || [];
    this.enemies = createEnemiesFromLevel(this.level.enemies || []);
    this.pickups = (this.level.pickups || []).map((pickup) => ({ ...pickup }));
    this.boss = createBossFromLevel(this.level.boss);
    this.exit = this.level.exit ? { ...this.level.exit } : null;
    this.player = new Player(this.level.spawn, C);

    this.projectiles = [];
    this.enemyProjectiles = [];
    this.input.reset();
    this.message = "Find the boss, defeat it, then reach the exit door.";
    this.messageTimer = 3.5;

    this.assetLoader.preloadLevelAssets(this.levelId).catch(() => {});
  }

  keyPressed(key) {
    this.input.keyPressed(key);
  }

  update(deltaSeconds = 1 / 60) {
    if (!this.player || this.levelComplete) return;

    this.messageTimer = Math.max(0, this.messageTimer - deltaSeconds);
    this.player.updateCooldowns(deltaSeconds);

    this.accumulator += Math.min(deltaSeconds, 0.05);
    while (this.accumulator >= this.fixedStep) {
      this.step(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }
  }

  step(deltaSeconds) {
    this.updatePlayer(deltaSeconds);
    this.updateEnemies(deltaSeconds);
    this.updateBoss(deltaSeconds);
    this.updateProjectiles(deltaSeconds);
    this.handlePickups();
    this.handleCombat();
    this.checkHazardsAndFalls();
    this.player.updateCheckpoint();
    this.tryOpenExit();
    this.tryCompleteLevel();
    this.updateCamera();
  }

  updatePlayer(deltaSeconds) {
    this.input.applyHorizontalMovement(this.player, deltaSeconds);
    this.input.applyJumpLogic(this.player, deltaSeconds);

    this.player.velocityY = Math.min(this.player.velocityY + C.gravity * deltaSeconds, C.maxFallSpeed);
    const previousX = this.player.x;
    const previousY = this.player.y;
    this.player.x += this.player.velocityX * deltaSeconds;
    this.player.y += this.player.velocityY * deltaSeconds;
    resolvePlatformCollision(this.player, this.platforms, previousX, previousY);
    this.player.x = clamp(this.player.x, 0, this.worldWidth - this.player.width);
  }

  updateEnemies(deltaSeconds) {
    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0);
    this.enemies.forEach((enemy) => {
      if (enemy.type === "roamer") {
        enemy.x += enemy.direction * enemy.speed * deltaSeconds;
        if (enemy.x <= enemy.patrolMinX) enemy.direction = 1;
        if (enemy.x + enemy.width >= enemy.patrolMaxX) enemy.direction = -1;
      }

      if (enemy.type === "chaser") {
        const distance = this.player.x - enemy.x;
        if (Math.abs(distance) < enemy.chaseRange) {
          enemy.x += Math.sign(distance) * enemy.speed * deltaSeconds;
        }
      }

      if (enemy.type === "flyer") {
        enemy.x += enemy.direction * enemy.speed * deltaSeconds;
        enemy.y += Math.sin(this.p.millis() * 0.004 + enemy.x * 0.01) * 0.7;
        if (enemy.x <= enemy.patrolMinX) enemy.direction = 1;
        if (enemy.x + enemy.width >= enemy.patrolMaxX) enemy.direction = -1;

        enemy.shootTimer -= deltaSeconds;
        if (enemy.shootTimer <= 0) {
          enemy.shootTimer = enemy.shootCooldown || 2.0;
          this.spawnEnemyOrb(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 260);
        }
      }
    });
  }

  updateBoss(deltaSeconds) {
    if (!this.boss || this.boss.hp <= 0) return;

    this.boss.x += this.boss.direction * this.boss.speed * deltaSeconds;
    if (this.boss.x <= this.boss.patrolMinX) this.boss.direction = 1;
    if (this.boss.x + this.boss.width >= this.boss.patrolMaxX) this.boss.direction = -1;

    if (this.boss.type === "forestRonin") {
      this.boss.attackTimer -= deltaSeconds;
      if (this.boss.attackTimer <= 0) {
        this.boss.attackTimer = this.boss.attackCooldown || 1.5;
        const slashBox = {
          x: this.boss.x - 18,
          y: this.boss.y - 6,
          width: this.boss.width + 36,
          height: this.boss.height + 12
        };
        if (overlaps(this.player, slashBox)) {
          this.damagePlayer(1, "The ronin's blade cuts through the mist.");
        }
      }
    }

    if (this.boss.type === "bathhouseMatron") {
      this.boss.attackTimer -= deltaSeconds;
      if (this.boss.attackTimer <= 0) {
        this.boss.attackTimer = this.boss.shotCooldown || 1.8;
        this.spawnBossSpread();
      }

      this.boss.summonTimer -= deltaSeconds;
      if (this.boss.summonTimer <= 0) {
        this.boss.summonTimer = this.boss.summonCooldown || 6.5;
        this.spawnSummonedEnemy();
      }
    }
  }

  spawnBossSpread() {
    const bx = this.boss.x + this.boss.width / 2;
    const by = this.boss.y + this.boss.height / 2;
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;
    const baseAngle = Math.atan2(py - by, px - bx);
    const speed = 300;
    [-0.35, 0, 0.35].forEach((offset) => {
      const angle = baseAngle + offset;
      this.enemyProjectiles.push({
        x: bx,
        y: by,
        width: 10,
        height: 10,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 3
      });
    });
  }

  spawnSummonedEnemy() {
    const summonX = clamp(this.boss.x - 120, 80, this.worldWidth - 160);
    const type = Math.random() < 0.5 ? "roamer" : "chaser";
    if (type === "roamer") {
      this.enemies.push(createEnemiesFromLevel([{
        type: "roamer",
        x: summonX,
        y: 640,
        width: 32,
        height: 32,
        patrolMinX: summonX - 80,
        patrolMaxX: summonX + 140,
        speed: 105,
        hp: 1
      }])[0]);
    } else {
      this.enemies.push(createEnemiesFromLevel([{
        type: "chaser",
        x: summonX,
        y: 640,
        width: 32,
        height: 32,
        chaseRange: 250,
        speed: 120,
        hp: 2
      }])[0]);
    }
  }

  spawnEnemyOrb(x, y, targetX, targetY, speed) {
    const angle = Math.atan2(targetY - y, targetX - x);
    this.enemyProjectiles.push({
      x,
      y,
      width: 10,
      height: 10,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: 3
    });
  }

  updateProjectiles(deltaSeconds) {
    this.projectiles.forEach((projectile) => {
      projectile.x += projectile.velocityX * deltaSeconds;
      projectile.y += projectile.velocityY * deltaSeconds;
      projectile.life -= deltaSeconds;
    });
    this.projectiles = this.projectiles.filter((projectile) => projectile.life > 0 && projectile.x > -40 && projectile.x < this.worldWidth + 40);

    this.enemyProjectiles.forEach((projectile) => {
      projectile.x += projectile.velocityX * deltaSeconds;
      projectile.y += projectile.velocityY * deltaSeconds;
      projectile.life -= deltaSeconds;
    });
    this.enemyProjectiles = this.enemyProjectiles.filter((projectile) => projectile.life > 0 && projectile.x > -60 && projectile.x < this.worldWidth + 60 && projectile.y > -60 && projectile.y < this.p.height + 60);
  }

  handlePickups() {
    this.pickups.forEach((pickup) => {
      if (pickup.collected) return;
      const rect = { x: pickup.x - 10, y: pickup.y - 10, width: 20, height: 20 };
      if (!overlaps(this.player, rect)) return;

      pickup.collected = true;
      this.player.applyPickup(pickup.type);
      this.message = `Obtained ${PICKUP_LABELS[pickup.type] || "Powerup"}`;
      this.messageTimer = 2.4;
    });
  }

  handleCombat() {
    if (this.input.consumeSwordRequest() && this.player.hasSword && this.player.swordCooldown <= 0) {
      this.player.swordCooldown = C.swordCooldown;
      this.performSwordSlash();
    }

    if (this.input.consumeOrbRequest() && this.player.hasOrbSigil && this.player.orbCooldown <= 0) {
      this.player.orbCooldown = C.orbCooldown;
      this.projectiles.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height / 2,
        width: 10,
        height: 10,
        velocityX: this.player.facing * C.orbSpeed,
        velocityY: 0,
        life: 2.2,
        damage: 1
      });
    }

    this.enemies.forEach((enemy) => {
      if (!overlaps(this.player, enemy)) return;
      if (this.isStompHit(enemy)) {
        enemy.hp = 0;
        this.player.velocityY = -C.jumpStrength * 0.48;
        this.message = "Stomp!";
        this.messageTimer = 0.8;
      } else {
        this.damagePlayer(C.enemyContactDamage, "A spirit strikes you.");
      }
    });

    if (this.boss && this.boss.hp > 0 && overlaps(this.player, this.boss)) {
      if (this.isStompHit(this.boss)) {
        this.boss.hp -= 1;
        this.player.y = this.boss.y - this.player.height;
        this.player.velocityY = -C.jumpStrength * 0.5;
        this.message = "Boss hit!";
        this.messageTimer = 0.8;
      } else {
        this.damagePlayer(1, "The boss overwhelms you.");
      }
    }

    this.enemyProjectiles = this.enemyProjectiles.filter((projectile) => {
      if (overlaps(this.player, projectile)) {
        this.damagePlayer(1, "Spirit orb hit!");
        return false;
      }
      return true;
    });

    this.projectiles = this.projectiles.filter((projectile) => {
      let hit = false;
      this.enemies.forEach((enemy) => {
        if (!hit && overlaps(enemy, projectile)) {
          enemy.hp -= projectile.damage || 1;
          hit = true;
        }
      });
      if (!hit && this.boss && this.boss.hp > 0 && overlaps(this.boss, projectile)) {
        this.boss.hp -= projectile.damage || 1;
        hit = true;
      }
      return !hit;
    });
  }

  performSwordSlash() {
    const slashRect = {
      x: this.player.facing > 0 ? this.player.x + this.player.width : this.player.x - C.swordRange,
      y: this.player.y + 4,
      width: C.swordRange,
      height: C.swordHeight
    };

    this.enemies.forEach((enemy) => {
      if (overlaps(enemy, slashRect)) enemy.hp -= 1;
    });

    if (this.boss && this.boss.hp > 0 && overlaps(this.boss, slashRect)) {
      this.boss.hp -= 1;
    }
  }

  checkHazardsAndFalls() {
    // Hazards are visual pit zones. Player should only lose life after actually falling.
    if (this.player.y > this.p.height + 120) {
      this.damagePlayer(1, "You fell into the abyss.", { ignoreBloomShield: true });
    }
  }

  isStompHit(target) {
    const playerBottom = this.player.y + this.player.height;
    const stompWindow = 20;
    return this.player.velocityY > 110 && playerBottom <= target.y + stompWindow;
  }

  damagePlayer(amount, reason, options = {}) {
    if (this.player.invulnerableTimer > 0) return;

    if (this.player.isGrown && !options.ignoreBloomShield) {
      this.player.shrinkFromBloom();
      this.player.invulnerableTimer = C.invulnerabilityTime;
      this.message = "Spirit Bloom shield broke!";
      this.messageTimer = 1.2;
      return;
    }

    this.player.hearts -= amount;
    this.player.invulnerableTimer = C.invulnerabilityTime;
    this.message = reason;
    this.messageTimer = 1.8;

    if (this.player.hearts > 0) {
      this.player.respawnAtCheckpoint();
      return;
    }

    this.player.resetPowerStateAfterDeath();
    this.message = "You were overwhelmed. Restarting this area.";
    this.messageTimer = 2.6;
    this.start(this.levelId);
  }

  tryOpenExit() {
    if (this.exitUnlocked) return;
    if (!this.boss || this.boss.hp <= 0) {
      this.exitUnlocked = true;
      this.message = "The exit gate opens.";
      this.messageTimer = 2.2;
    }
  }

  tryCompleteLevel() {
    if (!this.exitUnlocked || !this.exit || this.levelComplete) return;
    if (overlaps(this.player, this.exit)) {
      this.levelComplete = true;
      if (this.router.unlockLevel) {
        this.router.unlockLevel(this.levelId + 1);
      }
      this.router.navigateTo("lore", { level: this.levelId, phase: "end" });
    }
  }

  updateCamera() {
    const targetX = this.player.x - this.p.width * 0.35;
    this.cameraX = clamp(targetX, 0, Math.max(0, this.worldWidth - this.p.width));
  }

  draw() {
    this.renderer.draw(this);
  }
}

export default GameEngine;
