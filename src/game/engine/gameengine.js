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
import { clamp, overlaps, resolveEntityPlatformCollision, resolvePlatformCollision } from "../systems/physics.js";

const LEVEL_MAP = { 1: level1, 2: level2, 3: level3 };
const PICKUP_LABELS = {
  spiritBloom: "Spirit Bloom",
  moonBlade: "Moon Blade",
  orbSigil: "Orb Sigil"
};
const STAR_TIME_TARGETS = {
  1: 115,
  2: 145,
  3: 165
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
    this.levelState = "playing";
    this.clearSequenceTimer = 0;
    this.clearSequenceDuration = 1.35;
    this.overlay = null;
    this.levelElapsedTime = 0;
    this.damageTaken = 0;

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
    this.levelState = "playing";
    this.clearSequenceTimer = 0;
    this.overlay = null;
    this.levelElapsedTime = 0;
    this.damageTaken = 0;

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
    this.message = "Find the boss and survive the spirit trial.";
    this.messageTimer = 3.5;

    this.assetLoader.preloadLevelAssets(this.levelId).catch(() => {});
  }

  keyPressed(key) {
    this.input.keyPressed(key);
  }

  update(deltaSeconds = 1 / 60) {
    if (!this.player) return;
    if (this.levelState === "victoryModal" || this.levelState === "gameOverModal") return;

    this.messageTimer = Math.max(0, this.messageTimer - deltaSeconds);
    this.accumulator += Math.min(deltaSeconds, 0.05);

    if (this.levelState === "clearSequence") {
      while (this.accumulator >= this.fixedStep) {
        this.stepClearSequence(this.fixedStep);
        this.accumulator -= this.fixedStep;
      }
      return;
    }

    if (this.levelComplete) return;

    this.player.updateCooldowns(deltaSeconds);
    this.levelElapsedTime += deltaSeconds;

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

  stepClearSequence(deltaSeconds) {
    this.player.facing = 1;
    this.player.velocityX = C.moveSpeed * 0.42;
    this.player.velocityY = Math.min(this.player.velocityY + C.gravity * deltaSeconds, C.maxFallSpeed);

    const previousX = this.player.x;
    const previousY = this.player.y;
    this.player.x += this.player.velocityX * deltaSeconds;
    this.player.y += this.player.velocityY * deltaSeconds;
    resolvePlatformCollision(this.player, this.platforms, previousX, previousY);
    this.player.x = clamp(this.player.x, 0, this.worldWidth - this.player.width);

    this.clearSequenceTimer = Math.max(0, this.clearSequenceTimer - deltaSeconds);
    this.updateCamera();

    if (this.clearSequenceTimer <= 0) {
      this.finishLevel();
    }
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
    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0 && enemy.y < this.p.height + 180);
    this.enemies.forEach((enemy) => {
      const previousX = enemy.x;
      const previousY = enemy.y;

      if (enemy.type === "roamer") {
        enemy.velocityX = enemy.direction * enemy.speed;
        if (enemy.x <= enemy.patrolMinX) enemy.direction = 1;
        if (enemy.x + enemy.width >= enemy.patrolMaxX) enemy.direction = -1;
      }

      if (enemy.type === "chaser") {
        const distance = this.player.x - enemy.x;
        if (Math.abs(distance) < enemy.chaseRange) {
          enemy.direction = Math.sign(distance) || enemy.direction;
          enemy.velocityX = enemy.direction * enemy.speed;
        } else {
          enemy.velocityX = 0;
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

        return;
      }

      enemy.velocityY = Math.min(enemy.velocityY + C.gravity * deltaSeconds, C.maxFallSpeed);
      enemy.x += enemy.velocityX * deltaSeconds;
      enemy.y += enemy.velocityY * deltaSeconds;
      resolveEntityPlatformCollision(enemy, this.platforms, previousX, previousY);

      if (enemy.type === "roamer" && enemy.x <= enemy.patrolMinX) {
        enemy.x = enemy.patrolMinX;
        enemy.direction = 1;
      }
      if (enemy.type === "roamer" && enemy.x + enemy.width >= enemy.patrolMaxX) {
        enemy.x = enemy.patrolMaxX - enemy.width;
        enemy.direction = -1;
      }
    });
  }

  updateBoss(deltaSeconds) {
    if (!this.boss || this.boss.hp <= 0) return;

    const previousX = this.boss.x;
    const previousY = this.boss.y;
    let horizontalVelocity = this.boss.direction * this.boss.speed;

    if (this.boss.type === "forestRonin") {
      const playerCenterX = this.player.x + this.player.width / 2;
      const bossCenterX = this.boss.x + this.boss.width / 2;
      const distance = playerCenterX - bossCenterX;

      if (Math.abs(distance) < this.boss.chaseRange) {
        this.boss.direction = Math.sign(distance) || this.boss.direction;
        horizontalVelocity = this.boss.direction * this.boss.speed * 1.15;
      }

      this.boss.attackTimer -= deltaSeconds;
      if (this.boss.attackTimer <= 0) {
        this.boss.attackTimer = this.boss.attackCooldown || 1.5;
        const slashWidth = this.boss.width + 52;
        const slashX = this.boss.direction >= 0
          ? this.boss.x + this.boss.width - 8
          : this.boss.x - slashWidth + 8;
        const slashBox = {
          x: slashX,
          y: this.boss.y - 6,
          width: slashWidth,
          height: this.boss.height + 12
        };
        if (overlaps(this.player, slashBox)) {
          this.damagePlayer(1, "The ronin's blade cuts through the mist.");
        }
      }
    }

    if (this.boss.type === "bathhouseMatron") {
      const playerCenterX = this.player.x + this.player.width / 2;
      const bossCenterX = this.boss.x + this.boss.width / 2;
      const distance = playerCenterX - bossCenterX;
      if (Math.abs(distance) < this.boss.chaseRange) {
        this.boss.direction = Math.sign(distance) || this.boss.direction;
        horizontalVelocity = this.boss.direction * this.boss.speed;
      }

      this.boss.attackTimer -= deltaSeconds;
      if (this.boss.attackTimer <= 0) {
        this.boss.attackTimer = this.boss.shotCooldown || 1.8;
        this.spawnBossSpread();
      }
    }

    this.boss.velocityX = horizontalVelocity;
    this.boss.velocityY = Math.min(this.boss.velocityY + C.gravity * deltaSeconds, C.maxFallSpeed);
    this.boss.x += this.boss.velocityX * deltaSeconds;
    this.boss.y += this.boss.velocityY * deltaSeconds;
    resolveEntityPlatformCollision(this.boss, this.platforms, previousX, previousY);

    if (this.boss.x <= this.boss.patrolMinX) {
      this.boss.x = this.boss.patrolMinX;
      this.boss.direction = 1;
    }
    if (this.boss.x + this.boss.width >= this.boss.patrolMaxX) {
      this.boss.x = this.boss.patrolMaxX - this.boss.width;
      this.boss.direction = -1;
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
    if (this.levelState !== "playing") return;
    if (this.player.invulnerableTimer > 0) return;

    if (this.player.isGrown && !options.ignoreBloomShield) {
      this.player.shrinkFromBloom();
      this.player.invulnerableTimer = C.invulnerabilityTime;
      this.message = "Spirit Bloom shield broke!";
      this.messageTimer = 1.2;
      return;
    }

    this.player.hearts -= amount;
    this.damageTaken += amount;
    this.player.invulnerableTimer = C.invulnerabilityTime;
    this.message = reason;
    this.messageTimer = 1.8;

    if (this.player.hearts > 0) {
      this.player.respawnAtCheckpoint();
      return;
    }

    this.player.hearts = 0;
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.levelState = "gameOverModal";
    this.overlay = this.createGameOverOverlay();
    this.message = "";
    this.messageTimer = 0;
  }

  tryOpenExit() {
    if (this.levelState !== "playing") return;
    if (this.exitUnlocked) return;
    if (!this.boss || this.boss.hp <= 0) {
      this.beginLevelClearSequence();
    }
  }

  tryCompleteLevel() {
    return;
  }

  updateCamera() {
    const targetX = this.player.x - this.p.width * 0.35;
    this.cameraX = clamp(targetX, 0, Math.max(0, this.worldWidth - this.p.width));
  }

  beginLevelClearSequence() {
    this.exitUnlocked = true;
    this.levelState = "clearSequence";
    this.clearSequenceTimer = this.clearSequenceDuration;
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.enemies = [];
    this.message = "The spirit barrier is fading...";
    this.messageTimer = 1.6;
  }

  finishLevel() {
    this.levelComplete = true;
    this.levelState = "victoryModal";
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    if (this.router.unlockLevel) {
      this.router.unlockLevel(this.levelId + 1);
    }
    this.overlay = this.createVictoryOverlay();
  }

  createVictoryOverlay() {
    const stats = this.buildVictoryStats();
    const centerX = this.p.width / 2;
    const buttonY = this.p.height / 2 + 138;

    return {
      type: "victory",
      title: "A PATH THROUGH THE SPIRIT WORLD",
      subtitle: "You endured the trial and the veil begins to part.",
      stats,
      buttons: [
        this.createOverlayButton("MAIN MENU", centerX - 238, buttonY, 210, 58, () => {
          this.router.navigateTo("menu");
        }),
        this.createOverlayButton("NEXT", centerX + 28, buttonY, 210, 58, () => {
          this.router.navigateTo("lore", { level: this.levelId, phase: "end" });
        })
      ]
    };
  }

  createGameOverOverlay() {
    const centerX = this.p.width / 2;
    const buttonY = this.p.height / 2 + 120;

    return {
      type: "gameOver",
      title: "GAME OVER",
      subtitle: "The spirits closed in, but your path is not lost.",
      stats: null,
      buttons: [
        this.createOverlayButton("PLAY AGAIN", centerX - 238, buttonY, 210, 58, () => {
          this.start(this.levelId);
        }),
        this.createOverlayButton("MAIN MENU", centerX + 28, buttonY, 210, 58, () => {
          this.router.navigateTo("menu");
        })
      ]
    };
  }

  buildVictoryStats() {
    const heartGoalMet = this.player.hearts >= 2;
    const timeGoalMet = this.levelElapsedTime <= (STAR_TIME_TARGETS[this.levelId] || 150);
    const damageGoalMet = this.damageTaken <= 2;
    const stars = Math.max(1, [heartGoalMet, timeGoalMet, damageGoalMet].filter(Boolean).length);

    return {
      stars,
      hearts: this.player.hearts,
      timeSeconds: this.levelElapsedTime,
      damageTaken: this.damageTaken,
      heartGoalMet,
      timeGoalMet,
      damageGoalMet
    };
  }

  createOverlayButton(text, x, y, width, height, action) {
    return {
      text,
      x,
      y,
      width,
      height,
      hovered: false,
      action
    };
  }

  hasOverlay() {
    return this.levelState === "victoryModal" || this.levelState === "gameOverModal";
  }

  updateOverlayHover(mouseX, mouseY) {
    if (!this.overlay) return;
    this.overlay.buttons.forEach((button) => {
      button.hovered = this.isPointInsideButton(mouseX, mouseY, button);
    });
  }

  handleOverlayClick(mouseX, mouseY) {
    if (!this.overlay) return false;
    const button = this.overlay.buttons.find((candidate) => this.isPointInsideButton(mouseX, mouseY, candidate));
    if (!button) return false;
    button.action();
    return true;
  }

  isPointInsideButton(x, y, button) {
    return x >= button.x &&
      x <= button.x + button.width &&
      y >= button.y &&
      y <= button.y + button.height;
  }

  draw() {
    this.renderer.draw(this);
  }
}

export default GameEngine;
