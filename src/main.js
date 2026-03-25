import p5 from "p5";
import "./style.css";
import Router from "./router.js";
import MenuPage from "./pages/menu.js";
import LevelsPage from "./pages/level.js";
import LorePage from "./pages/lore.js";
import GamePage from "./pages/gamepage.js";

let router;
let menuPage, levelsPage, lorePage, gamePage;

new p5((p) => {
  p.setup = () => {
    p.createCanvas(1280, 720);
    p.frameRate(60);

    router = new Router();

    menuPage = new MenuPage(p, router);
    levelsPage = new LevelsPage(p, router);
    lorePage = new LorePage(p, router);
    gamePage = new GamePage(p, router);

    router.registerPage('menu', menuPage);
    router.registerPage('levels', levelsPage);
    router.registerPage('lore', lorePage);
    router.registerPage('game', gamePage);
    router.navigateTo('menu');
  };

  p.draw = () => {
    const currentPage = router.getCurrentPage();
    if (currentPage) {
      const deltaSeconds = Math.min(p.deltaTime / 1000, 0.05);
      currentPage.update(deltaSeconds);
      currentPage.draw();
    }
  };

  p.windowResized = () => {
    const currentPage = router.getCurrentPage();
    if (currentPage && currentPage.onResize) {
      currentPage.onResize(p.width, p.height);
    }
  };

  p.mousePressed = () => {
    router?.updateBackgroundMusic?.();
    const currentPage = router.getCurrentPage();
    if (currentPage && currentPage.mousePressed) {
      currentPage.mousePressed();
    }
  };

  p.mouseMoved = () => {
    const currentPage = router.getCurrentPage();
    if (currentPage && currentPage.mouseMoved) {
      currentPage.mouseMoved();
    }
  };

  p.mouseWheel = (event) => {
    const currentPage = router.getCurrentPage();
    if (currentPage && currentPage.mouseWheel) {
      return currentPage.mouseWheel(event);
    }
    return false;
  };

  p.keyPressed = () => {
    router?.updateBackgroundMusic?.();
    const currentPage = router.getCurrentPage();
    if (currentPage && currentPage.keyPressed) {
      currentPage.keyPressed(p.key);
    }
  };

  p.keyReleased = () => {
    const currentPage = router.getCurrentPage();
    if (currentPage && currentPage.keyReleased) {
      currentPage.keyReleased(p.key);
    }
  };
});
