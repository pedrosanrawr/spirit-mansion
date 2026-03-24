import lvlBackgroundPath from "../assets/levelbg.png";
import pixelFontPath from "../assets/Qaroxe.ttf";
import lvl1PreviewPath from "../assets/previews/lvl1_preview.png";
import lvl2PreviewPath from "../assets/previews/lvl2_preview.png";
import lvl3PreviewPath from "../assets/previews/lvl3_preview.png";

class LevelsPage {
  constructor(p, router) {
    this.p = p;
    this.router = router;
    this.buttons = [];
    this.lvlBackground = null;
    this.lvlBackgroundFailed = false;
    this.menuFont = null;
    this.levelPreviewImages = {};
    this.lanterns = [
      { xRatio: 0.09, yRatio: 0.58, phase: 0.2 },
      { xRatio: 0.82, yRatio: 0.53, phase: 2.4 },
      { xRatio: 0.97, yRatio: 0.55, phase: 2.9 }
    ];
    this.fireflies = this.createFireflies(26);
    this.title = "SELECT LEVEL";

    this.unlockedLevels = this.router.getUnlockedLevels ? this.router.getUnlockedLevels() : 1;
    this.totalLevels = 3;

    this.setupButtons();

    this.p.loadImage(lvlBackgroundPath)
      .then((img) => {
        this.lvlBackground = img;
      })
      .catch((error) => {
        this.lvlBackgroundFailed = true;
        console.error("Failed to load level background image:", error);
      });

    this.p.loadFont(pixelFontPath)
      .then((font) => {
        this.menuFont = font;
      })
      .catch((error) => {
        console.error("Failed to load level font:", error);
      });

    this.loadLevelPreviews();
  }

  setupButtons() {
    const centerX = this.p.width / 2;
    const startY = 193;
    const cardWidth = 250;
    const cardHeight = 350;
    const cardSpacing = 35;
    const totalWidth = this.totalLevels * cardWidth + (this.totalLevels - 1) * cardSpacing;
    const startX = centerX - totalWidth / 2;
    const levelNames = {
      1: "VILLAGE",
      2: "FOREST",
      3: "MANSION"
    };

    for (let i = 1; i <= this.totalLevels; i += 1) {
      const isUnlocked = i <= this.unlockedLevels;
      this.buttons.push({
        type: "levelCard",
        x: startX + (i - 1) * (cardWidth + cardSpacing),
        y: startY,
        width: cardWidth,
        height: cardHeight,
        text: levelNames[i] || `LEVEL ${i}`,
        level: i,
        unlocked: isUnlocked,
        action: isUnlocked ? () => this.router.navigateTo("lore", { level: i }) : null
      });
    }

    this.buttons.push({
      type: "backButton",
      x: 50,
      y: this.p.height - 70,
      width: 140,
      height: 52,
      text: "BACK",
      action: () => this.router.navigateTo("menu")
    });
  }

  onEnter() {
    this.syncUnlockedLevels();
  }

  update(deltaSeconds = 1 / 60) {
    this.updateFireflies(deltaSeconds);
  }

  draw() {
    if (this.lvlBackground) {
      this.p.image(this.lvlBackground, 0, 0, this.p.width, this.p.height);
    } else {
      this.p.background(30, 20, 40);
    }

    this.drawFireflies();
    this.drawLanternGlows();

    this.p.fill(184, 219, 255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    if (this.menuFont) {
      this.p.textFont(this.menuFont);
    }
    this.p.textSize(36);
    this.p.fill(134, 179, 227);
    this.p.text("SELECT LEVEL", this.p.width / 2 + 3, 100 + 3);

    this.p.fill(184, 219, 255);
    this.p.text("SELECT LEVEL", this.p.width / 2, 100);

    this.buttons.forEach((button) => {
      this.drawButton(button);
    });
  }

  drawButton(button) {
    if (button.type === "levelCard") {
      this.drawLevelCard(button);
      return;
    }

    this.drawPixelButton(button);
  }

  syncUnlockedLevels() {
    this.unlockedLevels = this.router.getUnlockedLevels ? this.router.getUnlockedLevels() : this.unlockedLevels;
    this.buttons.forEach((button) => {
      if (button.type !== "levelCard") return;
      button.unlocked = button.level <= this.unlockedLevels;
      button.action = button.unlocked
        ? () => this.router.navigateTo("lore", { level: button.level, phase: "start" })
        : null;
      if (!button.unlocked) {
        button.hovered = false;
      }
    });
  }

  drawPixelButton(button) {
    const pixel = 4;
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
    }
    this.p.textStyle(this.p.BOLD);
    this.p.textSize(18);
    this.p.text(button.text, x + w / 2, y + h / 2 + 1);
  }

  drawLevelCard(button) {
    const pixel = 4;
    const x = button.x;
    const y = button.y;
    const w = button.width;
    const h = button.height;
    const isLocked = button.unlocked === false;

    this.p.noStroke();
    this.p.fill(0, 0, 0, 120);
    this.p.rect(x + pixel * 2, y + pixel * 2, w, h);

    if (isLocked) {
      this.p.fill(46, 58, 74);
    } else {
      this.p.fill(button.hovered ? 60 : 44, button.hovered ? 102 : 84, button.hovered ? 148 : 125);
    }
    this.p.rect(x, y, w, h);

    this.p.fill(0);
    this.p.rect(x, y, w, pixel);
    this.p.rect(x, y, pixel, h);
    this.p.rect(x + w - pixel, y, pixel, h);
    this.p.rect(x, y + h - pixel, w, pixel);

    this.p.fill(isLocked ? 100 : 134, isLocked ? 112 : 179, isLocked ? 126 : 227);
    this.p.rect(x + pixel, y + pixel, w - pixel * 2, pixel);
    this.p.rect(x + pixel, y + pixel * 2, pixel, h - pixel * 3);

    this.p.fill(isLocked ? 36 : 29, isLocked ? 44 : 57, isLocked ? 55 : 87);
    this.p.rect(x + pixel, y + h - pixel * 2, w - pixel * 2, pixel);
    this.p.rect(x + w - pixel * 2, y + pixel, pixel, h - pixel * 3);

    const thumbX = x + 12;
    const thumbY = y + 16;
    const thumbW = w - 24;
    const thumbH = 225;

    this.p.fill(22, 34, 50);
    this.p.rect(thumbX, thumbY, thumbW, thumbH);
    this.p.fill(90, 118, 148);
    this.p.rect(thumbX, thumbY, thumbW, 6);

    const previewImage = this.levelPreviewImages[button.level];
    if (previewImage) {
      this.p.image(previewImage, thumbX, thumbY, thumbW, thumbH);
    } else {
      this.p.fill(170, 196, 222);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(14);
      this.p.text("PREVIEW", thumbX + thumbW / 2, thumbY + thumbH / 2);
    }

    this.p.fill(255);
    if (this.menuFont) {
      this.p.textFont(this.menuFont);
    }
    this.p.textStyle(this.p.BOLD);
    this.p.textSize(16);
    this.p.text(button.text, x + w / 2, y + 275);

    this.p.textSize(12);
    this.p.fill(isLocked ? 190 : 220, isLocked ? 190 : 235, isLocked ? 190 : 255);
    this.p.text(isLocked ? "LOCKED" : "CLICK TO PLAY", x + w / 2, y + 310);
  }

  loadLevelPreviews() {
    const previewMap = {
      1: lvl1PreviewPath,
      2: lvl2PreviewPath,
      3: lvl3PreviewPath
    };

    Object.entries(previewMap).forEach(([level, path]) => {
      this.p.loadImage(path)
        .then((img) => {
          this.levelPreviewImages[Number(level)] = img;
        })
        .catch((error) => {
          console.error(`Failed to load preview image for level ${level}:`, error);
        });
    });
  }

  createFireflies(count) {
    const fireflies = [];
    for (let i = 0; i < count; i += 1) {
      fireflies.push({
        x: this.p.random(0.06, 0.94) * this.p.width,
        y: this.p.random(0.35, 0.95) * this.p.height,
        vx: this.p.random(-18, 18),
        vy: this.p.random(-10, 10),
        size: this.p.random(2.0, 3.6),
        pulsePhase: this.p.random(0, this.p.TWO_PI),
        pulseSpeed: this.p.random(1.6, 4.0),
        wobblePhase: this.p.random(0, this.p.TWO_PI),
        wobbleSpeed: this.p.random(0.8, 2.6),
        wobbleAmp: this.p.random(8, 20)
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
      firefly.y += Math.cos(t * (firefly.wobbleSpeed + 0.7) + firefly.wobblePhase) * (firefly.wobbleAmp * 0.5) * deltaSeconds;

      if (firefly.x < -margin) firefly.x = this.p.width + margin;
      if (firefly.x > this.p.width + margin) firefly.x = -margin;
      if (firefly.y < this.p.height * 0.30) {
        firefly.y = this.p.height * 0.30;
        firefly.vy *= -1;
      }
      if (firefly.y > this.p.height + margin) firefly.y = this.p.height * 0.60;
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
      const outerSize = firefly.size * (3 + pulse * 1.9);

      this.p.fill(255, 245, 150, 18 + 30 * pulse);
      this.p.circle(firefly.x, firefly.y, outerSize);
      this.p.fill(255, 230, 110, 70 + 85 * pulse);
      this.p.circle(firefly.x, firefly.y, innerSize);
    });

    this.p.blendMode(this.p.BLEND);
    this.p.pop();
  }

  drawLanternGlows() {
    const minSide = Math.min(this.p.width, this.p.height);
    const t = this.p.millis() * 0.0042;

    this.p.push();
    this.p.noStroke();
    this.p.blendMode(this.p.ADD);

    this.lanterns.forEach((lantern) => {
      const cx = lantern.xRatio * this.p.width;
      const cy = lantern.yRatio * this.p.height;
      const flicker =
        0.55 +
        0.09 * Math.sin(t * 2.7 + lantern.phase) +
        0.06 * Math.sin(t * 6.1 + lantern.phase * 1.8);

      const outer = minSide * 0.050 * flicker;
      const mid = minSide * 0.036 * flicker;
      const inner = minSide * 0.016 * flicker;

      this.p.fill(255, 120, 40, 16);
      this.p.circle(cx, cy, outer * 2);

      this.p.fill(255, 170, 70, 28);
      this.p.circle(cx, cy, mid * 2);

      this.p.fill(255, 220, 140, 48);
      this.p.circle(cx, cy, inner * 2);
    });

    this.p.blendMode(this.p.BLEND);
    this.p.pop();
  }

  mousePressed() {
    this.buttons.forEach((button) => {
      if (button.unlocked !== false && this.isMouseOverButton(button)) {
        button.action();
      }
    });
  }

  mouseMoved() {
    this.buttons.forEach((button) => {
      if (button.unlocked !== false) {
        button.hovered = this.isMouseOverButton(button);
      }
    });
  }

  isMouseOverButton(button) {
    return this.p.mouseX >= button.x &&
           this.p.mouseX <= button.x + button.width &&
           this.p.mouseY >= button.y &&
           this.p.mouseY <= button.y + button.height;
  }
}

export default LevelsPage;
