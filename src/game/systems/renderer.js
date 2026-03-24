class Renderer {
  constructor(p) {
    this.p = p;
  }

  draw(engine) {
    this.drawBackground(engine);
    this.drawLevelGeometry(engine);
    this.drawPickups(engine);
    this.drawEnemies(engine);
    this.drawBoss(engine);
    this.drawProjectiles(engine);
    this.drawExit(engine);
    this.drawPlayer(engine);
    this.drawUI(engine);
  }

  drawBackground(engine) {
    const palette = {
      1: [26, 22, 38],
      2: [18, 35, 30],
      3: [22, 22, 46]
    };
    const color = palette[engine.levelId] || palette[1];
    this.p.background(color[0], color[1], color[2]);
    const levelBackground = engine.assets.levelBackgrounds?.[engine.levelId];
    if (!levelBackground) return;

    this.drawTiledLayer(levelBackground.background, engine.cameraX * 0.18, 0, this.p.height);

    const midLayerY = engine.levelId === 2 ? 107 : 0;
    const midLayerHeight = engine.levelId === 2 ? this.p.height * 1.2 : this.p.height;
    this.drawTiledLayer(levelBackground.midbackground, engine.cameraX * 0.42, midLayerY, midLayerHeight);
  }

  drawTiledLayer(image, cameraOffsetX, y, drawHeight) {
    if (!image) return;

    const aspectRatio = image.width / image.height;
    const drawWidth = Math.max(1, drawHeight * aspectRatio);
    const startX = -((cameraOffsetX % drawWidth) + drawWidth) % drawWidth - drawWidth;
    let tileIndex = 0;
    const overlapX = 2;

    for (let x = startX; x < this.p.width + drawWidth; x += drawWidth - overlapX)  {
      const shouldFlip = tileIndex % 2 === 1;
      this.drawFlippedImage(image, x, y, drawWidth, drawHeight, shouldFlip);
      tileIndex += 1;
    }
  }

  drawLevelGeometry(engine) {
    this.p.noStroke();
    this.p.fill(58, 72, 98);
    engine.platforms.forEach((platform) => {
      this.p.rect(platform.x - engine.cameraX, platform.y, platform.width, platform.height);
    });

    this.p.fill(8, 8, 18);
    engine.hazards.forEach((hazard) => {
      this.p.rect(hazard.x - engine.cameraX, hazard.y, hazard.width, hazard.height);
    });

    // Platform tile asset hook:
    // this.p.image(engine.assets.platformTile, x, y, width, height);
  }

  drawPickups(engine) {
    engine.pickups.forEach((pickup) => {
      if (pickup.collected) return;
      if (pickup.type === "spiritBloom") this.p.fill(120, 255, 145);
      if (pickup.type === "moonBlade") this.p.fill(210, 230, 255);
      if (pickup.type === "orbSigil") this.p.fill(170, 150, 255);
      this.p.circle(pickup.x - engine.cameraX, pickup.y, 16);
    });

    // Pickup asset hook:
    // this.p.image(engine.assets.pickups[pickup.type], pickup.x - engine.cameraX - 12, pickup.y - 12, 24, 24);
  }

  drawEnemies(engine) {
    engine.enemies.forEach((enemy) => {
      if (enemy.type === "roamer") this.p.fill(220, 110, 100);
      if (enemy.type === "chaser") this.p.fill(240, 160, 100);
      if (enemy.type === "flyer") this.p.fill(175, 120, 235);
      this.p.rect(enemy.x - engine.cameraX, enemy.y, enemy.width, enemy.height);
    });
  }

  drawBoss(engine) {
    if (!engine.boss || engine.boss.hp <= 0) return;
    this.p.fill(255, 80, 140);
    this.p.rect(engine.boss.x - engine.cameraX, engine.boss.y, engine.boss.width, engine.boss.height);

    const hpRatio = Math.max(0, Math.min(1, engine.boss.hp / engine.boss.maxHp));
    this.p.fill(30);
    this.p.rect(this.p.width - 250, 20, 220, 18);
    this.p.fill(230, 70, 90);
    this.p.rect(this.p.width - 250, 20, 220 * hpRatio, 18);
  }

  drawProjectiles(engine) {
    this.p.fill(180, 220, 255);
    engine.projectiles.forEach((projectile) => {
      this.p.circle(projectile.x - engine.cameraX, projectile.y, projectile.width);
    });

    this.p.fill(255, 160, 120);
    engine.enemyProjectiles.forEach((projectile) => {
      this.p.circle(projectile.x - engine.cameraX, projectile.y, projectile.width);
    });
  }

  drawExit(engine) {
    if (!engine.exit) return;
    this.p.fill(engine.exitUnlocked ? 130 : 90, engine.exitUnlocked ? 220 : 120, engine.exitUnlocked ? 170 : 120);
    this.p.rect(engine.exit.x - engine.cameraX, engine.exit.y, engine.exit.width, engine.exit.height);
  }

  drawPlayer(engine) {
    const player = engine.player;
    const blink = player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer * 18) % 2 === 0;
    if (blink) return;

    const animations = engine.assets.playerAnimations || {};
    const state = this.getPlayerAnimationState(player);
    const frames = animations[state] && animations[state].length > 0
      ? animations[state]
      : animations.idle || [];

    if (frames.length > 0) {
      const frameSpeed = state === "run" ? 12 : 8;
      const frameIndex = Math.floor((this.p.millis() / 1000) * frameSpeed) % frames.length;
      const sprite = frames[frameIndex];
      this.drawFlippedImage(sprite, player.x - engine.cameraX, player.y, player.width, player.height, player.facing < 0);
      return;
    }

    if (engine.assets.playerSprite) {
      this.drawFlippedImage(
        engine.assets.playerSprite,
        player.x - engine.cameraX,
        player.y,
        player.width,
        player.height,
        player.facing < 0
      );
      return;
    }

    // Fallback when no sprite assets are loaded.
    this.p.fill(180, 230, 255);
    this.p.rect(player.x - engine.cameraX, player.y, player.width, player.height);
  }

  getPlayerAnimationState(player) {
    if (!player.onGround) {
      return "jump";
    }
    if (Math.abs(player.velocityX) > 12) {
      return "run";
    }
    return "idle";
  }

  drawFlippedImage(image, x, y, w, h, flipX) {
    this.p.push();
    this.p.imageMode(this.p.CORNER);
    if (!flipX) {
      this.p.image(image, x, y, w, h);
    } else {
      this.p.translate(x + w, y);
      this.p.scale(-1, 1);
      this.p.image(image, 0, 0, w, h);
    }
    this.p.pop();
  }

  drawUI(engine) {
    const player = engine.player;
    const heartsText = `${"H".repeat(player.hearts)}${"-".repeat(player.maxHearts - player.hearts)}`;

    this.p.fill(255);
    this.p.textSize(16);
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.text(`Level: ${engine.level.name}`, 20, 18);
    this.p.text(`Hearts: ${heartsText}`, 20, 40);
    this.p.text(`Power: ${player.hasSword ? "Blade " : ""}${player.hasOrbSigil ? "Orb " : ""}${player.isGrown ? "Bloom" : ""}`.trim() || "None", 20, 62);
    this.p.text("Attack: J/K | Orb: L", 20, 84);
    this.p.text(`Progress: ${Math.floor((player.x / engine.worldWidth) * 100)}%`, 20, 106);

    if (engine.messageTimer > 0) {
      this.p.fill(215, 235, 255);
      this.p.text(engine.message, 20, 128);
    }

    if (!engine.exitUnlocked) {
      this.p.fill(255, 210, 150);
      this.p.text("Defeat the boss to unlock the exit.", this.p.width - 320, 42);
    } else {
      this.p.fill(150, 255, 180);
      this.p.text("Exit unlocked. Reach the door.", this.p.width - 270, 42);
    }
  }
}

export default Renderer;
