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

  static BOSS_LABELS = {
    villageWarden: "BOH",
    forestRonin: "YUBABA",
    bathhouseMatron: "NO-FACE"
  };

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
      const sprite = engine.assets.pickupSprites?.[pickup.type];
      if (sprite) {
        this.drawFloatingProp(sprite, pickup.x - engine.cameraX, pickup.y, 28, this.p.millis() * 0.0035 + pickup.x * 0.01);
        return;
      }

      if (pickup.type === "spiritBloom") this.p.fill(120, 255, 145);
      if (pickup.type === "moonBlade") this.p.fill(210, 230, 255);
      if (pickup.type === "orbSigil") this.p.fill(170, 150, 255);
      this.p.circle(pickup.x - engine.cameraX, pickup.y, 16);
    });
  }

  drawEnemies(engine) {
    engine.enemies.forEach((enemy) => {
      if (enemy.type === "roamer" && this.drawSusuwatari(enemy, engine)) {
        return;
      }
      if (enemy.type === "chaser" && this.drawSpirit(enemy, engine)) {
        return;
      }
      if (enemy.type === "flyer" && this.drawPaperbird(enemy, engine)) {
        return;
      }

      if (enemy.type === "roamer") this.p.fill(220, 110, 100);
      if (enemy.type === "chaser") this.p.fill(240, 160, 100);
      if (enemy.type === "flyer") this.p.fill(175, 120, 235);
      this.p.rect(enemy.x - engine.cameraX, enemy.y, enemy.width, enemy.height);
    });
  }

  drawSusuwatari(enemy, engine) {
    const susuwatari = engine.assets.enemySprites?.susuwatari;
    if (!susuwatari) return false;

    const isWalking = Math.abs(enemy.velocityX) > 4;
    const frames = isWalking && susuwatari.walk.length > 0
      ? susuwatari.walk
      : susuwatari.idle;

    if (!frames || frames.length === 0) return false;

    const frameSpeed = isWalking ? 10 : 5;
    const frameIndex = Math.floor((this.p.millis() / 1000) * frameSpeed) % frames.length;
    const sprite = frames[frameIndex];
    this.drawGlowingEnemyImage(
      sprite,
      enemy.x - engine.cameraX,
      enemy.y,
      enemy.width,
      enemy.height,
      enemy.direction < 0
    );
    return true;
  }

  drawSpirit(enemy, engine) {
    const spirit = engine.assets.enemySprites?.spirit;
    if (!spirit) return false;

    const isWalking = Math.abs(enemy.velocityX) > 4;
    const frames = isWalking && spirit.walk.length > 0
      ? spirit.walk
      : spirit.idle;

    if (!frames || frames.length === 0) return false;

    const frameSpeed = isWalking ? 8 : 4;
    const frameIndex = Math.floor((this.p.millis() / 1000) * frameSpeed) % frames.length;
    const sprite = frames[frameIndex];
    this.drawGlowingEnemyImage(
      sprite,
      enemy.x - engine.cameraX,
      enemy.y,
      enemy.width,
      enemy.height,
      enemy.direction < 0
    );
    return true;
  }

  drawPaperbird(enemy, engine) {
    const paperbird = engine.assets.enemySprites?.paperbird;
    const frames = paperbird?.fly || [];
    if (frames.length === 0) return false;

    const frameSpeed = 12;
    const frameIndex = Math.floor((this.p.millis() / 1000) * frameSpeed) % frames.length;
    const sprite = frames[frameIndex];
    this.drawGlowingEnemyImage(
      sprite,
      enemy.x - engine.cameraX,
      enemy.y,
      enemy.width,
      enemy.height,
      enemy.direction > 0
    );
    return true;
  }

  drawGlowingEnemyImage(image, x, y, w, h, flipX) {
    this.p.push();
    this.p.drawingContext.shadowBlur = 18;
    this.p.drawingContext.shadowColor = "rgba(210, 245, 255, 0.9)";
    this.p.tint(255, 245);
    this.drawFlippedImage(image, x, y, w, h, flipX);
    this.p.pop();
  }

  drawBoss(engine) {
    if (!engine.boss || engine.boss.hp <= 0) return;

    if (!this.drawVillageWardenBoss(engine.boss, engine) &&
      !this.drawForestRoninBoss(engine.boss, engine) &&
      !this.drawBathhouseMatronBoss(engine.boss, engine)) {
      this.p.fill(255, 80, 140);
      this.p.rect(engine.boss.x - engine.cameraX, engine.boss.y, engine.boss.width, engine.boss.height);
    }
  }

  drawVillageWardenBoss(boss, engine) {
    if (boss.type !== "villageWarden") return false;

    const boh = engine.assets.bossSprites?.boh;
    if (!boh) return false;

    const isWalking = Math.abs(boss.velocityX) > 4;
    const frames = isWalking && boh.walk.length > 0
      ? boh.walk
      : boh.idle;

    if (!frames || frames.length === 0) return false;

    const frameSpeed = isWalking ? 6 : 3;
    const frameIndex = Math.floor((this.p.millis() / 1000) * frameSpeed) % frames.length;
    const sprite = frames[frameIndex];
    const aspectRatio = sprite.width / sprite.height;
    const drawHeight = boss.height;
    const drawWidth = drawHeight * aspectRatio;
    const drawX = boss.x - engine.cameraX - (drawWidth - boss.width) / 2;
    const drawY = boss.y - (drawHeight - boss.height);
    this.drawBossImage(
      sprite,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      boss.direction < 0
    );
    return true;
  }

  drawForestRoninBoss(boss, engine) {
    if (boss.type !== "forestRonin") return false;

    const yubaba = engine.assets.bossSprites?.yubaba;
    if (!yubaba) return false;

    let frames = yubaba.idle || [];
    let frameSpeed = 2;
    let useReverseWalkFrame = false;
    const isAttacking = (boss.attackAnimationTimer || 0) > 0;

    if (isAttacking && (yubaba.attack || []).length > 0) {
      frames = yubaba.attack;
    } else if (Math.abs(boss.velocityX) > 4 && (yubaba.walk || []).length > 0) {
      frames = yubaba.walk;
      frameSpeed = 5;
      useReverseWalkFrame = true;
    }

    if (!frames || frames.length === 0) return false;

    const frameIndex = Math.floor((this.p.millis() / 1000) * frameSpeed) % frames.length;
    const sprite = frames[frameIndex];
    const aspectRatio = sprite.width / sprite.height;
    const drawHeight = boss.height;
    const drawWidth = drawHeight * aspectRatio;
    const drawX = boss.x - engine.cameraX - (drawWidth - boss.width) / 2;
    const drawY = boss.y - (drawHeight - boss.height);
    const playerCenterX = engine.player.x + engine.player.width / 2;
    const bossCenterX = boss.x + boss.width / 2;
    let flipX = isAttacking
      ? playerCenterX > bossCenterX
      : boss.direction < 0;

    if (useReverseWalkFrame && frameIndex % 2 === 1) {
      flipX = !flipX;
    }

    this.drawBossImage(
      sprite,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      flipX
    );
    return true;
  }

  drawBathhouseMatronBoss(boss, engine) {
    if (boss.type !== "bathhouseMatron") return false;

    const noface = engine.assets.bossSprites?.noface;
    if (!noface) return false;

    const isShooting = (boss.attackAnimationTimer || 0) > 0;
    const isMoving = Math.abs(boss.velocityX) > 4;
    let frames = noface.idle || [];
    let frameSpeed = 2;

    if (isShooting && (noface.shoot || []).length > 0) {
      frames = noface.shoot;
    } else if (isMoving && (noface.float || []).length > 0) {
      frames = noface.float;
      frameSpeed = 5;
    }

    if (!frames || frames.length === 0) return false;

    const frameIndex = Math.floor((this.p.millis() / 1000) * frameSpeed) % frames.length;
    const sprite = frames[frameIndex];
    const aspectRatio = sprite.width / sprite.height;
    const drawHeight = boss.height;
    const drawWidth = drawHeight * aspectRatio;
    const drawX = boss.x - engine.cameraX - (drawWidth - boss.width) / 2;
    const drawY = boss.y - (drawHeight - boss.height);
    const flipX = isShooting
      ? boss.facing < 0
      : boss.direction < 0;

    this.drawBossImage(
      sprite,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      flipX
    );
    return true;
  }

  drawBossImage(image, x, y, w, h, flipX) {
    this.p.push();
    this.p.drawingContext.shadowBlur = 28;
    this.p.drawingContext.shadowColor = "rgba(255, 190, 120, 0.9)";
    this.p.tint(255, 255);
    this.drawFlippedImage(image, x, y, w, h, flipX);
    this.p.pop();
  }

  drawProjectiles(engine) {
    engine.projectiles.forEach((projectile) => {
      if (this.drawProjectileSprite(engine.assets.props?.playerOrb, projectile, engine.cameraX, 22)) return;
      this.p.fill(180, 220, 255);
      this.p.circle(projectile.x - engine.cameraX, projectile.y, projectile.width);
    });

    engine.enemyProjectiles.forEach((projectile) => {
      if (this.drawProjectileSprite(engine.assets.props?.enemyOrb, projectile, engine.cameraX, 22)) return;
      this.p.fill(255, 160, 120);
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
      const drawScale = 1.9;
      const aspectRatio = sprite.width / sprite.height;
      const drawHeight = player.height * drawScale;
      const drawWidth = drawHeight * aspectRatio;
      const drawX = player.x - engine.cameraX - (drawWidth - player.width) / 2;
      const drawY = player.y - (drawHeight - player.height);
      this.drawFlippedImage(sprite, drawX, drawY, drawWidth, drawHeight, player.facing < 0);
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
    if (player.hasSword && player.attackAnimationTimer > 0) {
      return "attack";
    }
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
    this.p.push();
    const panelX = 16;
    const panelY = 14;
    const panelW = this.p.width - 32;
    const panelH = 86;

    this.drawPixelPanel(panelX, panelY, panelW, panelH);
    this.drawSingleHeader(engine, panelX, panelY, panelW, panelH);
    this.p.pop();

    if (engine.messageTimer > 0) {
      this.p.push();
      this.p.textFont(this.menuFont || "monospace");
      this.p.textAlign(this.p.LEFT, this.p.TOP);
      this.p.textSize(14);
      this.p.fill(215, 235, 255);
      this.p.text(engine.message, 20, this.p.height - 34);
      this.p.pop();
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
      this.drawStarRow(this.p.width / 2, boxY + 150, engine.overlay.stats.stars, engine.assets.props?.star);

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

  drawStar(cx, cy, outerRadius, innerRadius, filled, sprite) {
    if (sprite) {
      this.p.push();
      this.p.imageMode(this.p.CENTER);
      if (!filled) this.p.tint(130, 150, 170, 210);
      else this.p.tint(255, 255);
      this.p.image(sprite, cx, cy, outerRadius * 2.3, outerRadius * 2.3);
      this.p.pop();
      return;
    }

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

  drawFloatingProp(image, x, y, size, phase = 0) {
    this.p.push();
    this.p.imageMode(this.p.CENTER);
    this.p.drawingContext.shadowBlur = 18;
    this.p.drawingContext.shadowColor = "rgba(210, 235, 255, 0.7)";
    this.p.image(image, x, y + Math.sin(phase) * 4, size, size);
    this.p.pop();
  }

  drawProjectileSprite(image, projectile, cameraX, size) {
    if (!image) return false;
    const angle = Math.atan2(projectile.velocityY || 0, projectile.velocityX || 1);
    this.p.push();
    this.p.translate(projectile.x - cameraX, projectile.y);
    this.p.rotate(angle);
    this.p.imageMode(this.p.CENTER);
    this.p.drawingContext.shadowBlur = 16;
    this.p.drawingContext.shadowColor = "rgba(220, 240, 255, 0.8)";
    this.p.image(image, 0, 0, size, size);
    this.p.pop();
    return true;
  }

  drawPixelPanel(x, y, w, h) {
    const pixel = 4;
    this.p.noStroke();
    this.p.fill(0, 0, 0, 100);
    this.p.rect(x + pixel * 2, y + pixel * 2, w, h);

    this.p.fill(44, 84, 125, 232);
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
  }

  drawSingleHeader(engine, x, y, w, h) {
    const player = engine.player;
    const props = engine.assets.props || {};
    const boss = engine.boss;
    const bossName = Renderer.BOSS_LABELS[boss?.type] || "SPIRIT";
    const hpRatio = boss ? Math.max(0, Math.min(1, boss.hp / boss.maxHp)) : 0;
    const leftSectionX = x + 40;
    const leftSectionW = 210;
    const iconY = y + 40;
    const iconSpacing = leftSectionW / 3;

    this.p.push();
    this.p.textFont(this.menuFont || "monospace");
    this.p.textStyle(this.p.BOLD);
    this.p.textAlign(this.p.LEFT, this.p.CENTER);

    this.drawHeaderSkillIcon(leftSectionX + iconSpacing * 0.5, iconY, props.bloom, player.isGrown);
    this.drawHeaderSkillIcon(leftSectionX + iconSpacing * 1.5, iconY, props.sword, player.hasSword);
    this.drawHeaderSkillIcon(leftSectionX + iconSpacing * 2.5, iconY, props.playerOrb, player.hasOrbSigil);

    const barW = Math.min(360, w * 0.34);
    const barH = 16;
    const barX = x + (w - barW) / 2;
    const barY = y + 18;
    this.p.noStroke();
    this.p.fill(15, 24, 36, 220);
    this.p.rect(barX, barY, barW, barH);
    this.p.fill(230, 70, 90);
    this.p.rect(barX, barY, barW * hpRatio, barH);

    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(14);
    this.p.fill(255, 244, 236);
    this.p.text(`${boss ? boss.hp : 0}/${boss ? boss.maxHp : 0}`, x + w / 2, barY + barH / 2 + 1);
    this.p.textSize(12);
    this.p.fill(204, 224, 247);
    this.p.text(bossName, x + w / 2, y + 48);

    const statusY = y + 40;
    const timeX = x + w - 255;
    const heartsX = x + w - 126;
    this.drawStatusRow(timeX, statusY, props.clock, this.formatTime(engine.levelElapsedTime || 0), 18);
    this.drawHeartsRow(engine, heartsX, statusY, props.heart);

    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(11);
    this.p.fill(216, 230, 247);
    this.p.text(
      "MOVE A/D OR ARROWS   JUMP W/UP/SPACE   SWORD J/K   ORB L   ESC PAUSE",
      x + w / 2,
      y + h - 18
    );
    this.p.pop();
  }

  drawHeaderSkillIcon(x, y, image, active) {
    this.p.push();
    this.p.noStroke();
    this.p.fill(active ? 20 : 12, active ? 45 : 24, active ? 73 : 36, 180);
    this.p.rect(x - 18, y - 18, 36, 36);

    if (image) {
      this.p.imageMode(this.p.CENTER);
      this.p.tint(255, active ? 255 : 72);
      this.p.image(image, x, y, 24, 24);
      this.p.noTint();
    } else {
      this.p.fill(255, 255, 255, active ? 255 : 72);
      this.p.circle(x, y, 16);
    }
    this.p.pop();
  }

  drawStatusRow(x, y, image, text, iconSize) {
    this.p.push();
    this.p.textAlign(this.p.LEFT, this.p.CENTER);
    this.p.textSize(14);
    if (image) {
      this.p.imageMode(this.p.CENTER);
      this.p.image(image, x + iconSize / 2, y, iconSize, iconSize);
    } else {
      this.p.fill(255);
      this.p.circle(x + iconSize / 2, y, iconSize - 4);
    }

    this.p.fill(245, 248, 255);
    this.p.text(text, x + iconSize + 10, y + 1);
    this.p.pop();
  }

  drawHeartsRow(engine, x, y, image) {
    const total = engine.player.maxHearts || 3;
    const filled = engine.player.hearts || 0;

    this.p.push();
    this.p.textAlign(this.p.LEFT, this.p.CENTER);
    if (image) {
      for (let i = 0; i < total; i += 1) {
        this.p.push();
        this.p.imageMode(this.p.CENTER);
        if (i >= filled) this.p.tint(120, 135, 160, 110);
        this.p.image(image, x + 11 + i * 28, y, 22, 22);
        this.p.pop();
      }
      this.p.pop();
      return;
    }

    this.p.fill(245, 120, 145);
    this.p.text(`${filled}/${total}`, x, y + 1);
    this.p.pop();
  }

  drawStarRow(centerX, y, earnedStars, sprite = null) {
    const spacing = 62;
    for (let i = 0; i < 3; i += 1) {
      const x = centerX + (i - 1) * spacing;
      const filled = i < earnedStars;
      this.drawStar(x, y, 22, 10, filled, sprite);
    }
  }
}

export default Renderer;
