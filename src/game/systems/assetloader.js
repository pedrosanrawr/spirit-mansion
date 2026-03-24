import villageBackgroundPath from "../../assets/village/background.png";
import villageMidbackgroundPath from "../../assets/village/midbackground.png";
import forestBackgroundPath from "../../assets/forest/background.png";
import forestMidbackgroundPath from "../../assets/forest/midbackground.png";

class AssetLoader {
  constructor(p) {
    this.p = p;
    this.assets = {
      levelBackgrounds: {},
      platformTile: null,
      playerSprite: null,
      playerAnimations: {
        idle: [],
        run: [],
        jump: []
      },
      enemySprites: {},
      pickupSprites: {}
    };
  }

  async loadOptionalImage(path) {
    try {
      return await this.p.loadImage(path);
    } catch {
      return null;
    }
  }

  async loadFrameSeries(basePath, prefix, frameCount) {
    const frames = [];
    for (let i = 1; i <= frameCount; i += 1) {
      const frame = await this.loadOptionalImage(`${basePath}/${prefix}_${i}.png`);
      if (frame) frames.push(frame);
    }
    return frames;
  }

  async preloadCommonAssets() {
    // Put your player frames in: public/assets/player/
    // Naming expected:
    // idle_1.png, idle_2.png, ...
    // run_1.png, run_2.png, ...
    // jump_1.png, jump_2.png, ...
    const playerBase = "/assets/player";
    this.assets.playerAnimations.idle = await this.loadFrameSeries(playerBase, "idle", 8);
    this.assets.playerAnimations.run = await this.loadFrameSeries(playerBase, "run", 12);
    this.assets.playerAnimations.jump = await this.loadFrameSeries(playerBase, "jump", 6);

    // Fallback single sprite if no animation frames exist.
    if (
      this.assets.playerAnimations.idle.length === 0 &&
      this.assets.playerAnimations.run.length === 0 &&
      this.assets.playerAnimations.jump.length === 0
    ) {
      this.assets.playerSprite = await this.loadOptionalImage(`${playerBase}/player.png`);
    }
  }

  async preloadLevelAssets(levelId) {
    if (levelId === 1 && !this.assets.levelBackgrounds[1]) {
      const background = await this.loadOptionalImage(villageBackgroundPath);
      const midbackground = await this.loadOptionalImage(villageMidbackgroundPath);
      this.assets.levelBackgrounds[1] = {
        background,
        midbackground
      };
    }

    if (levelId === 2 && !this.assets.levelBackgrounds[2]) {
      const background = await this.loadOptionalImage(forestBackgroundPath);
      const midbackground = await this.loadOptionalImage(forestMidbackgroundPath);
      this.assets.levelBackgrounds[2] = {
        background,
        midbackground
      };
    }
  }

  getAssets() {
    return this.assets;
  }
}

export default AssetLoader;
