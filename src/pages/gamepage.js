import GameEngine from "../game/engine/gameengine.js";

class GamePage {
  constructor(p, router) {
    this.p = p;
    this.router = router;
    this.pauseMenu = false;
    this.level = 1;
    this.engine = new GameEngine(p, router);
  }

  onEnter(data) {
    this.pauseMenu = false;
    this.level = data?.level || this.router.getSelectedLevel() || 1;
    this.engine.start(this.level);
  }

  update(deltaSeconds = 1 / 60) {
    if (this.pauseMenu) return;
    this.engine.update(deltaSeconds);
  }

  draw() {
    this.engine.draw();
    if (this.pauseMenu) {
      this.drawPauseMenu();
    }
  }

  drawPauseMenu() {
    this.p.fill(0, 0, 0, 155);
    this.p.rect(0, 0, this.p.width, this.p.height);

    this.p.fill(255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(36);
    this.p.text("PAUSED", this.p.width / 2, this.p.height / 2 - 54);
    this.p.textSize(18);
    this.p.text("Press ESC to resume", this.p.width / 2, this.p.height / 2);
    this.p.text("Press M for Main Menu", this.p.width / 2, this.p.height / 2 + 30);
  }

  keyPressed(key) {
    if (this.engine.hasOverlay && this.engine.hasOverlay()) {
      return;
    }

    if (this.engine.isHelpDialogOpen && this.engine.isHelpDialogOpen()) {
      if (key === "Escape") {
        this.engine.toggleHelpDialog(false);
      }
      return;
    }

    if (this.pauseMenu) {
      if (key === "Escape") {
        this.pauseMenu = false;
      } else if (key === "m" || key === "M") {
        this.router.navigateTo("menu");
      }
      return;
    }

    if (key === "Escape") {
      this.pauseMenu = true;
      return;
    }

    this.engine.keyPressed(key);
  }

  mousePressed() {
    if (this.engine.isHelpDialogOpen && this.engine.isHelpDialogOpen()) {
      this.engine.toggleHelpDialog(false);
      return;
    }

    if (this.engine.handleOverlayClick && this.engine.handleOverlayClick(this.p.mouseX, this.p.mouseY)) {
      return;
    }

    if (this.engine.handleHeaderClick && this.engine.handleHeaderClick(this.p.mouseX, this.p.mouseY)) {
      return;
    }
  }

  mouseMoved() {
    if (this.engine.updateOverlayHover) {
      this.engine.updateOverlayHover(this.p.mouseX, this.p.mouseY);
    }
    if (this.engine.updateHeaderHover) {
      this.engine.updateHeaderHover(this.p.mouseX, this.p.mouseY);
    }
  }
}

export default GamePage;
