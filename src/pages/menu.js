import menuBackgroundPath from "../assets/menubg.png";
import pixelFontPath from "../assets/Qaroxe.ttf";

class MenuPage {
  constructor(p, router) {
    this.p = p;
    this.router = router;
    this.buttons = [];
    this.menuBackground = null;
    this.menuBackgroundFailed = false;
    this.menuFont = null;
    this.helpDialogOpen = false;
    this.helpScroll = 0;
    this.helpMaxScroll = 0;
    this.lanterns = [
      { xRatio: 0.182, yRatio: 0.710, phase: 0.2 },
      { xRatio: 0.765, yRatio: 0.742, phase: 2.4 }
    ];
    this.fireflies = this.createFireflies(24);

    this.p.loadImage(menuBackgroundPath)
      .then((img) => {
        this.menuBackground = img;
      })
      .catch((error) => {
        this.menuBackgroundFailed = true;
        console.error("Failed to load menu background image:", error);
      });

    this.p.loadFont(pixelFontPath)
      .then((font) => {
        this.menuFont = font;
      })
      .catch((error) => {
        console.error("Failed to load menu font:", error);
      });
    this.setupButtons();
  }

  setupButtons() {
    const centerX = this.p.width / 2;
    const centerY = this.p.height / 2;

    this.buttons.push({
      x: centerX - 100,
      y: centerY + 120,
      width: 220,
      height: 60,
      text: "START GAME",
      action: () => this.router.navigateTo('lore', { level: 1, phase: "start" })
    });

    this.buttons.push({
      x: centerX - 100,
      y: centerY + 200,
      width: 220,
      height: 60,
      text: "LEVELS",
      action: () => this.router.navigateTo('levels')
    });

    this.buttons.push({
      x: this.p.width - 60,
      y: 20,
      width: 40,
      height: 40,
      text: this.router.isSoundEnabled() ? "/" : "X",
      action: () => {
        this.router.toggleSound();
        this.updateSoundButton();
      }
    });

    this.buttons.push({
      x: this.p.width - 110,
      y: 20,
      width: 40,
      height: 40,
      text: "?",
      action: () => this.showHelp()
    });
  }

  updateSoundButton() {
    this.buttons[2].text = this.router.isSoundEnabled() ? "/" : "X";
  }

  showHelp() {
    this.helpDialogOpen = true;
    this.helpScroll = 0;
  }

  onEnter() {
    this.helpDialogOpen = false;
    this.helpScroll = 0;
  }

  update(deltaSeconds = 1 / 60) {
    this.updateFireflies(deltaSeconds);
  }

  draw() {
    if (this.menuBackground) {
      this.p.image(this.menuBackground, 0, 0, this.p.width, this.p.height);
    } else {
      this.p.background(30, 20, 40);
    }

    this.drawFireflies();
    this.drawLanternGlows();

    this.p.fill(44, 84, 125);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    if (this.menuFont) {
      this.p.textFont(this.menuFont);
    }
    this.p.textSize(55);
    this.p.fill(134, 179, 227);
    this.p.text("ESCAPE FROM THE", this.p.width / 2 + 3, 170 + 3);
    this.p.text("SPIRIT MANSION", this.p.width / 2 + 3, 230 + 3);

    this.p.fill(184, 219, 255);
    this.p.text("ESCAPE FROM THE", this.p.width / 2, 170);
    this.p.text("SPIRIT MANSION", this.p.width / 2, 230);

    this.p.noSmooth();
    this.buttons.forEach(button => {
      this.drawButton(button);
    });
    this.p.smooth();
    this.drawHelpDialog();
  }

  createFireflies(count) {
    const fireflies = [];
    for (let i = 0; i < count; i += 1) {
      fireflies.push({
        x: this.p.random(0.08, 0.92) * this.p.width,
        y: this.p.random(0.45, 0.9) * this.p.height,
        vx: this.p.random(-16, 16),
        vy: this.p.random(-8, 8),
        size: this.p.random(2.2, 2.5),
        pulsePhase: this.p.random(0, this.p.TWO_PI),
        pulseSpeed: this.p.random(1.5, 3.8),
        wobblePhase: this.p.random(0, this.p.TWO_PI),
        wobbleSpeed: this.p.random(0.8, 2.4),
        wobbleAmp: this.p.random(8, 18)
      });
    }
    return fireflies;
  }

  updateFireflies(deltaSeconds) {
    const t = this.p.millis() * 0.001;
    const margin = 30;
    this.fireflies.forEach((firefly) => {
      firefly.x += firefly.vx * deltaSeconds;
      firefly.y += firefly.vy * deltaSeconds;

      firefly.x += Math.sin(t * firefly.wobbleSpeed + firefly.wobblePhase) * firefly.wobbleAmp * deltaSeconds;
      firefly.y += Math.cos(t * (firefly.wobbleSpeed + 0.6) + firefly.wobblePhase) * (firefly.wobbleAmp * 0.55) * deltaSeconds;

      if (firefly.x < -margin) firefly.x = this.p.width + margin;
      if (firefly.x > this.p.width + margin) firefly.x = -margin;
      if (firefly.y < this.p.height * 0.38) {
        firefly.y = this.p.height * 0.38;
        firefly.vy *= -1;
      }
      if (firefly.y > this.p.height + margin) firefly.y = this.p.height * 0.55;
    });
  }

  drawFireflies() {
    const t = this.p.millis() * 0.0032;
    this.p.push();
    this.p.noStroke();
    this.p.blendMode(this.p.ADD);
    this.fireflies.forEach((firefly) => {
      const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * firefly.pulseSpeed + firefly.pulsePhase));
      const innerSize = firefly.size;
      const outerSize = firefly.size * (3 + pulse * 1.8);

      this.p.fill(255, 245, 150, 20 + 35 * pulse);
      this.p.circle(firefly.x, firefly.y, outerSize);
      this.p.fill(255, 230, 110, 70 + 90 * pulse);
      this.p.circle(firefly.x, firefly.y, innerSize);
    });
    this.p.blendMode(this.p.BLEND);
    this.p.pop();
  }

  drawLanternGlows() {
    const minSide = Math.min(this.p.width, this.p.height);
    const t = this.p.millis() * 0.004;

    this.p.push();
    this.p.noStroke();
    this.p.blendMode(this.p.ADD);

    this.lanterns.forEach((lantern) => {
      const cx = lantern.xRatio * this.p.width;
      const cy = lantern.yRatio * this.p.height;
      const flicker =
        0.2 +
        0.04 * Math.sin(t * 2.8 + lantern.phase) +
        0.03 * Math.sin(t * 6.4 + lantern.phase * 1.9);

      const outer = minSide * 0.11 * flicker;
      const mid = minSide * 0.075 * flicker;
      const inner = minSide * 0.042 * flicker;

      this.p.fill(255, 120, 40, 22);
      this.p.circle(cx, cy, outer * 2);

      this.p.fill(255, 170, 70, 38);
      this.p.circle(cx, cy, mid * 2);

      this.p.fill(255, 220, 140, 70);
      this.p.circle(cx, cy, inner * 2);
    });

    this.p.blendMode(this.p.BLEND);
    this.p.pop();
  }

  drawButton(button) {
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
    this.p.noStroke();
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    if (this.menuFont) {
      this.p.textFont(this.menuFont);
    } else {
      this.p.textFont("monospace");
    }
    this.p.textStyle(this.p.BOLD);
    this.p.textSize(button.width > 50 ? 18 : 20);
    this.p.text(button.text, x + w / 2, y + h / 2 + 1);
  }

  drawHelpDialog() {
    if (!this.helpDialogOpen) return;

    this.p.push();
    this.p.noStroke();
    this.p.fill(8, 10, 18, 190);
    this.p.rect(0, 0, this.p.width, this.p.height);

    const boxW = 860;
    const boxH = 500;
    const boxX = (this.p.width - boxW) / 2;
    const boxY = (this.p.height - boxH) / 2;
    const textX = boxX + 38;
    const contentTop = boxY + 84;
    const viewportY = boxY + 78;
    const viewportH = boxH - 126;
    const viewportW = boxW - 68;

    this.drawPixelPanel(boxX, boxY, boxW, boxH);

    this.p.textFont(this.menuFont || "monospace");
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textStyle(this.p.BOLD);
    this.p.textSize(24);
    this.p.fill(236, 244, 255);
    this.p.text("HOW TO PLAY", this.p.width / 2, boxY + 42);

    const helpLines = [
      "GOAL",
      "Guide Chihiro through the spirit world, survive each stage, defeat the boss, and clear all three chapters to escape the mansion.",
      "",
      "CONTROL KEYS",
      "MOVE: LEFT / RIGHT",
      "JUMP: UP",
      "SWORD: J or K",
      "ORB: L",
      "PAUSE: ESC",
      "",
      "SKILLS",
      "Spirit Bloom: makes Chihiro larger and absorbs one hit before breaking.",
      "Moon Blade: unlocks melee attacks so you can slash nearby enemies.",
      "Orb Sigil: unlocks ranged spirit orbs that travel straight ahead.",
      "",
      "ENEMIES AND BOSSES",
      "Roamer: patrols a fixed area and damages the player on contact.",
      "Chaser: stays idle at first, then runs toward the player when close enough.",
      "Flyer: moves in the air and fires spirit orbs from a distance.",
      "Boh: the Village boss with high health and close-range pressure.",
      "Yubaba: the Forest boss that chases and performs sword-range attacks.",
      "No-Face: the Mansion boss that floats and fires spread projectiles."
    ];

    const contentHeight = this.measureHelpSectionHeight(helpLines);
    this.helpMaxScroll = Math.max(0, contentHeight - viewportH);
    this.helpScroll = Math.min(this.helpScroll, this.helpMaxScroll);

    const ctx = this.p.drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.rect(boxX + 24, viewportY, viewportW, viewportH);
    ctx.clip();

    this.p.push();
    this.p.translate(0, -this.helpScroll);
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.textSize(14);
    this.drawHelpSection(helpLines, textX, contentTop, viewportW - 28);
    this.p.pop();

    ctx.restore();

    this.drawScrollIndicator(boxX + boxW - 24, viewportY, viewportH, this.helpScroll, this.helpMaxScroll);

    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(13);
    this.p.fill(255, 220, 168);
    this.p.text("Scroll to read, then click anywhere or press ESC to close", this.p.width / 2, boxY + boxH - 34);
    this.p.pop();
  }

  drawHelpSection(lines, x, y, width) {
    let currentY = y;
    lines.forEach((line, index) => {
      if (!line) {
        currentY += 10;
        return;
      }

      const isHeading = index === 0 || line === "SKILLS";
      this.p.fill(isHeading ? 236 : 214, isHeading ? 244 : 228, isHeading ? 255 : 247);
      this.p.textStyle(isHeading ? this.p.BOLD : this.p.NORMAL);
      this.p.textSize(isHeading ? 16 : 14);
      this.p.text(line, x, currentY, width, isHeading ? 22 : 56);
      currentY += isHeading ? 28 : 44;
    });
    return currentY - y;
  }

  measureHelpSectionHeight(lines) {
    let total = 0;
    lines.forEach((line, index) => {
      if (!line) {
        total += 10;
        return;
      }

      const isHeading = index === 0 || line === "SKILLS";
      total += isHeading ? 28 : 44;
    });
    return total;
  }

  drawScrollIndicator(x, y, height, scroll, maxScroll) {
    if (maxScroll <= 0) return;

    const thumbHeight = Math.max(54, height * 0.28);
    const thumbTravel = Math.max(0, height - thumbHeight);
    const thumbY = y + (scroll / maxScroll) * thumbTravel;

    this.p.noStroke();
    this.p.fill(18, 29, 48, 220);
    this.p.rect(x, y, 8, height);
    this.p.fill(170, 210, 255, 220);
    this.p.rect(x, thumbY, 8, thumbHeight);
  }

  adjustHelpScroll(delta) {
    if (!this.helpDialogOpen || this.helpMaxScroll <= 0) return;
    this.helpScroll = this.p.constrain(this.helpScroll + delta, 0, this.helpMaxScroll);
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

  mousePressed() {
    if (this.helpDialogOpen) {
      this.helpDialogOpen = false;
      return;
    }

    this.buttons.forEach(button => {
      if (this.isMouseOverButton(button)) {
        this.router.playUiClickSound?.();
        button.action();
      }
    });
  }

  keyPressed(key) {
    if (this.helpDialogOpen) {
      if (key === "Escape") {
        this.helpDialogOpen = false;
      } else if (key === "ArrowDown") {
        this.adjustHelpScroll(40);
      } else if (key === "ArrowUp") {
        this.adjustHelpScroll(-40);
      }
    }
  }

  mouseWheel(event) {
    if (!this.helpDialogOpen) return false;
    this.adjustHelpScroll(event.delta);
    return false;
  }

  mouseMoved() {
    this.buttons.forEach(button => {
      button.hovered = this.isMouseOverButton(button);
    });
  }

  isMouseOverButton(button) {
    return this.p.mouseX >= button.x &&
           this.p.mouseX <= button.x + button.width &&
           this.p.mouseY >= button.y &&
           this.p.mouseY <= button.y + button.height;
  }
}

export default MenuPage;
