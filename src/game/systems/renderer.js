import pixelFontPath from "../../assets/Qaroxe.ttf";

class Renderer {
  constructor(p) {
    this.p = p;
    this.menuFont = null;

    this.p.loadFont(pixelFontPath)
      .then((font) => {
        this.menuFont = font;
      })
      .catch(() => {});
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
    this.drawOverlay(engine);
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

    const midLayerY = engine.levelId === 2 ? 33 : 60;
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
    const platformAssets = engine.assets.levelBackgrounds?.[engine.levelId] || {};
    const floatingGround = platformAssets.floatingGround;
    const ground = platformAssets.ground;
    engine.platforms.forEach((platform) => {
      if (ground && platform.height >= 80) {
        this.p.image(ground, platform.x - engine.cameraX, platform.y, platform.width, platform.height);
        return;
      }
      if (floatingGround && platform.height < 80) {
        this.p.image(floatingGround, platform.x - engine.cameraX, platform.y, platform.width, platform.height);
        return;
      }
      this.p.rect(platform.x - engine.cameraX, platform.y, platform.width, platform.height);
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
    return;
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
    this.p.text(`Time: ${this.formatTime(engine.levelElapsedTime || 0)}`, 20, 106);
    this.p.text(`Progress: ${Math.floor((player.x / engine.worldWidth) * 100)}%`, 20, 128);

    if (engine.messageTimer > 0) {
      this.p.fill(215, 235, 255);
      this.p.text(engine.message, 20, 150);
    }

    if (!engine.exitUnlocked) {
      this.p.fill(255, 210, 150);
      this.p.text("Defeat the boss to break the spirit barrier.", this.p.width - 405, 42);
    } else if (!engine.hasOverlay()) {
      this.p.fill(150, 255, 180);
      this.p.text("The path is opening...", this.p.width - 230, 42);
    }
  }

  drawOverlay(engine) {
    if (engine.levelState === "clearSequence") {
      const progress = 1 - (engine.clearSequenceTimer / engine.clearSequenceDuration);
      this.p.fill(8, 10, 18, Math.min(185, 45 + progress * 140));
      this.p.rect(0, 0, this.p.width, this.p.height);
      return;
    }

    if (!engine.overlay) return;

    this.p.push();
    this.p.noStroke();
    this.p.fill(8, 10, 18, 190);
    this.p.rect(0, 0, this.p.width, this.p.height);

    const boxW = 700;
    const boxH = engine.overlay.type === "victory" ? 360 : 300;
    const boxX = (this.p.width - boxW) / 2;
    const boxY = (this.p.height - boxH) / 2 - 10;
    const pixel = 4;

    this.p.fill(0, 0, 0, 110);
    this.p.rect(boxX + pixel * 2, boxY + pixel * 2, boxW, boxH);

    this.p.fill(27, 47, 85);
    this.p.rect(boxX, boxY, boxW, boxH);

    this.p.fill(0);
    this.p.rect(boxX, boxY, boxW, pixel);
    this.p.rect(boxX, boxY, pixel, boxH);
    this.p.rect(boxX + boxW - pixel, boxY, pixel, boxH);
    this.p.rect(boxX, boxY + boxH - pixel, boxW, pixel);

    this.p.fill(137, 183, 236);
    this.p.rect(boxX + pixel, boxY + pixel, boxW - pixel * 2, pixel);
    this.p.rect(boxX + pixel, boxY + pixel * 2, pixel, boxH - pixel * 3);

    this.p.fill(23, 39, 64);
    this.p.rect(boxX + pixel, boxY + boxH - pixel * 2, boxW - pixel * 2, pixel);
    this.p.rect(boxX + boxW - pixel * 2, boxY + pixel, pixel, boxH - pixel * 3);

    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textFont(this.menuFont || "monospace");
    this.p.textStyle(this.p.BOLD);
    this.p.fill(220, 236, 255);
    this.p.textSize(28);
    this.p.text(engine.overlay.title, this.p.width / 2, boxY + 56);

    this.p.textStyle(this.p.NORMAL);
    this.p.textSize(16);
    this.p.fill(189, 216, 245);
    this.p.text(engine.overlay.subtitle, this.p.width / 2, boxY + 95);

    if (engine.overlay.stats) {
      this.drawStarRow(this.p.width / 2, boxY + 150, engine.overlay.stats.stars);

      this.p.textSize(18);
      this.p.fill(237, 243, 255);
      this.p.text(`Hearts Left: ${engine.overlay.stats.hearts}`, this.p.width / 2, boxY + 205);
      this.p.text(`Time: ${this.formatTime(engine.overlay.stats.timeSeconds)}`, this.p.width / 2, boxY + 235);
      this.p.text(`Wounds Taken: ${engine.overlay.stats.damageTaken}`, this.p.width / 2, boxY + 265);
    } else {
      this.p.textSize(18);
      this.p.fill(237, 243, 255);
      this.p.text("Rise again and keep moving through the mansion.", this.p.width / 2, boxY + 170);
    }

    engine.overlay.buttons.forEach((button) => {
      this.drawPixelButton(button);
    });
    this.p.pop();
  }

  drawPixelButton(button) {
    const pixel = button.width > 50 ? 4 : 2;
    const pressedOffset = button.hovered ? pixel : 0;
    const x = button.x + pressedOffset;
    const y = button.y + pressedOffset;
    const w = button.width;
    const h = button.height;

    this.p.noStroke();
    this.p.fill(0, 0, 0, 110);
    this.p.rect(x + pixel * 2, y + pixel * 2, w, h);

    this.p.fill(button.hovered ? 60 : 44, button.hovered ? 102 : 84, button.hovered ? 148 : 125);
    this.p.rect(x, y, w, h);

    this.p.fill(0);
    this.p.rect(x, y, w, pixel);
    this.p.rect(x, y, pixel, h);
    this.p.rect(x + w - pixel, y, pixel, h);
    this.p.rect(x, y + h - pixel, w, pixel);

    this.p.fill(134, 179, 227);
    this.p.rect(x + pixel, y + pixel, w - pixel * 2, pixel);
    this.p.rect(x + pixel, y + pixel * 2, pixel, h - pixel * 3);

    this.p.fill(29, 57, 87);
    this.p.rect(x + pixel, y + h - pixel * 2, w - pixel * 2, pixel);
    this.p.rect(x + w - pixel * 2, y + pixel, pixel, h - pixel * 3);

    this.p.fill(255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textFont(this.menuFont || "monospace");
    this.p.textStyle(this.p.BOLD);
    this.p.textSize(18);
    this.p.text(button.text, x + w / 2, y + h / 2 + 1);
  }

  drawStarRow(centerX, y, earnedStars) {
    const spacing = 62;
    for (let i = 0; i < 3; i += 1) {
      const x = centerX + (i - 1) * spacing;
      const filled = i < earnedStars;
      this.drawStar(x, y, 22, 10, filled);
    }
  }

  drawStar(cx, cy, outerRadius, innerRadius, filled) {
    this.p.push();
    this.p.beginShape();
    this.p.stroke(16, 24, 36);
    this.p.strokeWeight(3);
    this.p.fill(filled ? this.p.color(255, 220, 120) : this.p.color(84, 100, 128));
    for (let i = 0; i < 10; i += 1) {
      const angle = -this.p.HALF_PI + (i * this.p.PI) / 5;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      this.p.vertex(
        cx + Math.cos(angle) * radius,
        cy + Math.sin(angle) * radius
      );
    }
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }

  formatTime(totalSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }
}

export default Renderer;
