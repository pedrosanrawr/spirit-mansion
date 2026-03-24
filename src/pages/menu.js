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
    alert("Controls:\n- Arrow Keys: Move\n- Space: Jump/Skip Lore\n- ESC: Pause");
  }

  onEnter() {
    // Called when entering this page
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

  mousePressed() {
    this.buttons.forEach(button => {
      if (this.isMouseOverButton(button)) {
        button.action();
      }
    });
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
