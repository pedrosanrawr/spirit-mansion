import villageBackgroundPath from "../../assets/village/background.png";
import villageMidbackgroundPath from "../../assets/village/midbackground.png";
import villageFloatingGroundPath from "../../assets/village/floatingground.png";
import villageGroundPath from "../../assets/village/ground.png";
import forestBackgroundPath from "../../assets/forest/background.png";
import forestMidbackgroundPath from "../../assets/forest/midbackground.png";
import forestFloatingGroundPath from "../../assets/forest/floatingground.png";
import forestGroundPath from "../../assets/forest/ground.png";
import castleBackgroundPath from "../../assets/castle/background.png";
import castleMidbackgroundPath from "../../assets/castle/midbackground.png";
import castleFloatingGroundPath from "../../assets/castle/floatingground.png";
import castleGroundPath from "../../assets/castle/ground.png";
import susuwatariIdlePath from "../../assets/sprites/susuwatari/idle.png";
import susuwatariWalk1Path from "../../assets/sprites/susuwatari/walk1.png";
import susuwatariWalk2Path from "../../assets/sprites/susuwatari/walk2.png";
import susuwatariWalk3Path from "../../assets/sprites/susuwatari/walk3.png";
import spiritIdlePath from "../../assets/sprites/spirit/idle.png";
import spiritSquashPath from "../../assets/sprites/spirit/squash.png";
import spiritWalk1Path from "../../assets/sprites/spirit/walk1.png";
import spiritWalk2Path from "../../assets/sprites/spirit/walk2.png";
import paperbirdFly1Path from "../../assets/sprites/paperbird/fly1.png";
import paperbirdFly2Path from "../../assets/sprites/paperbird/fly2.png";
import paperbirdFly3Path from "../../assets/sprites/paperbird/fly3.png";
import paperbirdFly4Path from "../../assets/sprites/paperbird/fly4.png";
import bohIdlePath from "../../assets/sprites/boh/idle.png";
import bohSquashPath from "../../assets/sprites/boh/squash.png";
import bohWalk1Path from "../../assets/sprites/boh/walk1.png";
import bohWalk2Path from "../../assets/sprites/boh/walk2.png";
import yubabaIdlePath from "../../assets/sprites/yubaba/idle.png";
import yubabaWalk1Path from "../../assets/sprites/yubaba/walk1.png";
import yubabaWalk2Path from "../../assets/sprites/yubaba/walk2.png";
import yubabaAttackPath from "../../assets/sprites/yubaba/attack.png";
import nofaceIdlePath from "../../assets/sprites/noface/idle.png";
import nofaceFloat1Path from "../../assets/sprites/noface/float1.png";
import nofaceFloatsteady2Path from "../../assets/sprites/noface/floatsteady2.png";
import nofaceFloat3Path from "../../assets/sprites/noface/float3.png";
import nofaceShootPath from "../../assets/sprites/noface/shoot.png";
import chiroIdlePath from "../../assets/sprites/chihiro2/idle.png";
import chiroWalk1Path from "../../assets/sprites/chihiro2/walk.png";
import chiroWalk2Path from "../../assets/sprites/chihiro2/walk2.png";
import chiroJumpPath from "../../assets/sprites/chihiro2/jump.png";
import chiroSwordStandPath from "../../assets/sprites/chihiro2/sword_idle.png";
import chiroSwordWalkPath from "../../assets/sprites/chihiro2/sword_walk.png";
import chiroSwordSwingPath from "../../assets/sprites/chihiro2/sword_swing.png";
import bloomPropPath from "../../assets/props/bloom.png";
import clockPropPath from "../../assets/props/clock.png";
import enemyOrbPropPath from "../../assets/props/enemyorb.png";
import heartPropPath from "../../assets/props/heart.png";
import playerOrbPropPath from "../../assets/props/playerorb.png";
import starPropPath from "../../assets/props/star.png";
import swordPropPath from "../../assets/props/sword.png";

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
        jump: [],
        attack: [],
        swordIdle: [],
        swordRun: [],
        swordAttack: []
      },
      enemySprites: {},
      bossSprites: {},
      pickupSprites: {},
      props: {}
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
    const chiroFrames = await Promise.all([
      this.loadOptionalImage(chiroIdlePath),
      this.loadOptionalImage(chiroWalk1Path),
      this.loadOptionalImage(chiroWalk2Path),
      this.loadOptionalImage(chiroJumpPath),
      this.loadOptionalImage(chiroSwordStandPath),
      this.loadOptionalImage(chiroSwordWalkPath),
      this.loadOptionalImage(chiroSwordSwingPath)
    ]);

    this.assets.playerAnimations.idle = chiroFrames[0] ? [chiroFrames[0]] : [];
    this.assets.playerAnimations.run = chiroFrames.slice(1, 3).filter(Boolean);
    this.assets.playerAnimations.jump = chiroFrames[3] ? [chiroFrames[3]] : [];
    this.assets.playerAnimations.attack = chiroFrames[6] ? [chiroFrames[6]] : [];
    this.assets.playerAnimations.swordIdle = chiroFrames[4] ? [chiroFrames[4]] : [];
    this.assets.playerAnimations.swordRun = chiroFrames[5] ? [chiroFrames[5]] : [];
    this.assets.playerAnimations.swordAttack = chiroFrames[6] ? [chiroFrames[6]] : [];

    if (
      this.assets.playerAnimations.idle.length === 0 &&
      this.assets.playerAnimations.run.length === 0 &&
      this.assets.playerAnimations.jump.length === 0 &&
      this.assets.playerAnimations.attack.length === 0 &&
      this.assets.playerAnimations.swordIdle.length === 0 &&
      this.assets.playerAnimations.swordRun.length === 0 &&
      this.assets.playerAnimations.swordAttack.length === 0
    ) {
      this.assets.playerSprite = null;
    }

    const susuwatariFrames = await Promise.all([
      this.loadOptionalImage(susuwatariIdlePath),
      this.loadOptionalImage(susuwatariWalk1Path),
      this.loadOptionalImage(susuwatariWalk2Path),
      this.loadOptionalImage(susuwatariWalk3Path)
    ]);

    this.assets.enemySprites.susuwatari = {
      idle: susuwatariFrames[0] ? [susuwatariFrames[0]] : [],
      walk: susuwatariFrames.slice(1).filter(Boolean)
    };

    const spiritFrames = await Promise.all([
      this.loadOptionalImage(spiritIdlePath),
      this.loadOptionalImage(spiritSquashPath),
      this.loadOptionalImage(spiritWalk1Path),
      this.loadOptionalImage(spiritWalk2Path)
    ]);

    this.assets.enemySprites.spirit = {
      idle: spiritFrames.slice(0, 2).filter(Boolean),
      walk: spiritFrames.slice(2).filter(Boolean)
    };

    const paperbirdFrames = await Promise.all([
      this.loadOptionalImage(paperbirdFly1Path),
      this.loadOptionalImage(paperbirdFly2Path),
      this.loadOptionalImage(paperbirdFly3Path),
      this.loadOptionalImage(paperbirdFly4Path)
    ]);

    this.assets.enemySprites.paperbird = {
      fly: paperbirdFrames.filter(Boolean)
    };

    const bohFrames = await Promise.all([
      this.loadOptionalImage(bohIdlePath),
      this.loadOptionalImage(bohSquashPath),
      this.loadOptionalImage(bohWalk1Path),
      this.loadOptionalImage(bohWalk2Path)
    ]);

    this.assets.bossSprites.boh = {
      idle: bohFrames.slice(0, 2).filter(Boolean),
      walk: bohFrames.slice(2).filter(Boolean)
    };

    const yubabaFrames = await Promise.all([
      this.loadOptionalImage(yubabaIdlePath),
      this.loadOptionalImage(yubabaWalk1Path),
      this.loadOptionalImage(yubabaWalk2Path),
      this.loadOptionalImage(yubabaAttackPath)
    ]);

    this.assets.bossSprites.yubaba = {
      idle: yubabaFrames[0] ? [yubabaFrames[0]] : [],
      walk: yubabaFrames.slice(1, 3).filter(Boolean),
      attack: yubabaFrames[3] ? [yubabaFrames[3]] : []
    };

    const nofaceFrames = await Promise.all([
      this.loadOptionalImage(nofaceIdlePath),
      this.loadOptionalImage(nofaceFloat1Path),
      this.loadOptionalImage(nofaceFloatsteady2Path),
      this.loadOptionalImage(nofaceFloat3Path),
      this.loadOptionalImage(nofaceShootPath)
    ]);

    this.assets.bossSprites.noface = {
      idle: nofaceFrames[0] ? [nofaceFrames[0]] : [],
      float: nofaceFrames.slice(1, 4).filter(Boolean),
      shoot: nofaceFrames[4] ? [nofaceFrames[4]] : []
    };

    const propImages = await Promise.all([
      this.loadOptionalImage(bloomPropPath),
      this.loadOptionalImage(clockPropPath),
      this.loadOptionalImage(enemyOrbPropPath),
      this.loadOptionalImage(heartPropPath),
      this.loadOptionalImage(playerOrbPropPath),
      this.loadOptionalImage(starPropPath),
      this.loadOptionalImage(swordPropPath)
    ]);

    this.assets.props = {
      bloom: propImages[0],
      clock: propImages[1],
      enemyOrb: propImages[2],
      heart: propImages[3],
      playerOrb: propImages[4],
      star: propImages[5],
      sword: propImages[6]
    };

    this.assets.pickupSprites = {
      spiritBloom: this.assets.props.bloom,
      moonBlade: this.assets.props.sword,
      orbSigil: this.assets.props.playerOrb
    };
  }

  async preloadLevelAssets(levelId) {
    if (levelId === 1 && !this.assets.levelBackgrounds[1]) {
      const background = await this.loadOptionalImage(villageBackgroundPath);
      const midbackground = await this.loadOptionalImage(villageMidbackgroundPath);
      const floatingGround = await this.loadOptionalImage(villageFloatingGroundPath);
      const ground = await this.loadOptionalImage(villageGroundPath);
      this.assets.levelBackgrounds[1] = {
        background,
        midbackground,
        floatingGround,
        ground
      };
    }

    if (levelId === 2 && !this.assets.levelBackgrounds[2]) {
      const background = await this.loadOptionalImage(forestBackgroundPath);
      const midbackground = await this.loadOptionalImage(forestMidbackgroundPath);
      const floatingGround = await this.loadOptionalImage(forestFloatingGroundPath);
      const ground = await this.loadOptionalImage(forestGroundPath);
      this.assets.levelBackgrounds[2] = {
        background,
        midbackground,
        floatingGround,
        ground
      };
    }

    if (levelId === 3 && !this.assets.levelBackgrounds[3]) {
      const background = await this.loadOptionalImage(castleBackgroundPath);
      const midbackground = await this.loadOptionalImage(castleMidbackgroundPath);
      const floatingGround = await this.loadOptionalImage(castleFloatingGroundPath);
      const ground = await this.loadOptionalImage(castleGroundPath);
      this.assets.levelBackgrounds[3] = {
        background,
        midbackground,
        floatingGround,
        ground
      };
    }
  }

  getAssets() {
    return this.assets;
  }
}

export default AssetLoader;
