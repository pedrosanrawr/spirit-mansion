import mainMenuThemeTrack from "./assets/audio/main-menu-theme.mp3";
import level1ThemeTrack from "./assets/audio/level-1-theme.mp3";
import level2ThemeTrack from "./assets/audio/level-2-theme.mp3";
import level3ThemeTrack from "./assets/audio/level-3-theme.mp3";
import gameplaySfxPackTrack from "./assets/audio/gameplay-sfx-pack.mp3";
import uiClickSfxTrack from "./assets/audio/ui-click-sfx.mp3";
import levelClearJingleTrack from "./assets/audio/level-clear-jingle.mp3";

class Router {
  constructor() {
    this.currentPage = 'menu';
    this.pages = {};
    this.selectedLevel = 1;
    this.soundEnabled = true;
    this.maxLevels = 3;
    this.storageKey = "spirit_mansion_progress_v1";
    this.unlockedLevels = this.loadUnlockedLevels();
    this.backgroundAudio = null;
    this.activeBackgroundTrack = null;
    this.uiClickAudio = null;
    this.uiClickTimeoutId = null;
    this.jumpAudio = null;
    this.jumpTimeoutId = null;
    this.bloomAudio = null;
    this.bloomTimeoutId = null;
    this.bloomBreakAudio = null;
    this.bloomBreakTimeoutId = null;
    this.heroDeathAudio = null;
    this.heroDeathTimeoutId = null;
    this.weaponPickupAudio = null;
    this.weaponPickupTimeoutId = null;
    this.orbCastAudio = null;
    this.orbCastTimeoutId = null;
    this.victoryAudio = null;
  }

  registerPage(name, pageClass) {
    this.pages[name] = pageClass;
  }

  navigateTo(pageName, data = null) {
    if (this.pages[pageName]) {
      const previousPage = this.pages[this.currentPage];
      if (previousPage && previousPage.onExit) {
        previousPage.onExit();
      }

      if (data?.level) {
        const requestedLevel = Number(data.level);
        const canAccess = this.canAccessLevel(requestedLevel);
        if (!canAccess && (pageName === "game" || pageName === "lore")) {
          data = { ...data, level: this.unlockedLevels };
        }
      }

      this.currentPage = pageName;
      if (data) {
        this.selectedLevel = data.level;
      }
      this.updateBackgroundMusic();
      if (this.pages[pageName].onEnter) {
        this.pages[pageName].onEnter(data);
      }
    }
  }

  getCurrentPage() {
    return this.pages[this.currentPage];
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.updateBackgroundMusic();
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  getSelectedLevel() {
    return this.selectedLevel;
  }

  getUnlockedLevels() {
    return this.unlockedLevels;
  }

  canAccessLevel(level) {
    return level >= 1 && level <= this.maxLevels && level <= this.unlockedLevels;
  }

  unlockLevel(level) {
    const safeLevel = Math.max(1, Math.min(this.maxLevels, Number(level) || 1));
    if (safeLevel <= this.unlockedLevels) return;
    this.unlockedLevels = safeLevel;
    this.saveUnlockedLevels();
  }

  loadUnlockedLevels() {
    if (typeof window === "undefined" || !window.localStorage) return 1;
    const rawValue = window.localStorage.getItem(this.storageKey);
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return 1;
    return Math.max(1, Math.min(this.maxLevels, Math.floor(parsed)));
  }

  saveUnlockedLevels() {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(this.storageKey, String(this.unlockedLevels));
  }

  getBackgroundAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.backgroundAudio) {
      this.backgroundAudio = new Audio();
      this.backgroundAudio.loop = true;
      this.backgroundAudio.volume = 0.4;
    }
    return this.backgroundAudio;
  }

  getUiClickAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.uiClickAudio) {
      this.uiClickAudio = new Audio(uiClickSfxTrack);
      this.uiClickAudio.preload = "auto";
      this.uiClickAudio.volume = 0.7;
    }
    return this.uiClickAudio;
  }

  getJumpAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.jumpAudio) {
      this.jumpAudio = new Audio(gameplaySfxPackTrack);
      this.jumpAudio.preload = "auto";
      this.jumpAudio.volume = 0.18;
    }
    return this.jumpAudio;
  }

  getBloomAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.bloomAudio) {
      this.bloomAudio = new Audio(gameplaySfxPackTrack);
      this.bloomAudio.preload = "auto";
      this.bloomAudio.volume = 0.18;
    }
    return this.bloomAudio;
  }

  getBloomBreakAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.bloomBreakAudio) {
      this.bloomBreakAudio = new Audio(gameplaySfxPackTrack);
      this.bloomBreakAudio.preload = "auto";
      this.bloomBreakAudio.volume = 0.18;
    }
    return this.bloomBreakAudio;
  }

  getHeroDeathAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.heroDeathAudio) {
      this.heroDeathAudio = new Audio(gameplaySfxPackTrack);
      this.heroDeathAudio.preload = "auto";
      this.heroDeathAudio.volume = 0.18;
    }
    return this.heroDeathAudio;
  }

  getWeaponPickupAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.weaponPickupAudio) {
      this.weaponPickupAudio = new Audio(gameplaySfxPackTrack);
      this.weaponPickupAudio.preload = "auto";
      this.weaponPickupAudio.volume = 0.18;
    }
    return this.weaponPickupAudio;
  }

  getOrbCastAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.orbCastAudio) {
      this.orbCastAudio = new Audio(gameplaySfxPackTrack);
      this.orbCastAudio.preload = "auto";
      this.orbCastAudio.volume = 0.18;
    }
    return this.orbCastAudio;
  }

  getVictoryAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.victoryAudio) {
      this.victoryAudio = new Audio(levelClearJingleTrack);
      this.victoryAudio.preload = "auto";
      this.victoryAudio.volume = 0.55;
    }
    return this.victoryAudio;
  }

  playUiClickSound() {
    if (!this.soundEnabled) return;

    const uiClickAudio = this.getUiClickAudio();
    if (!uiClickAudio) return;

    const startTime = 14.15;
    const endTime = 15;
    const playSegment = () => {
      window.clearTimeout(this.uiClickTimeoutId);
      uiClickAudio.pause();
      uiClickAudio.currentTime = startTime;
      const playPromise = uiClickAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.error("Failed to start UI click sound:", error);
        });
      }
      this.uiClickTimeoutId = window.setTimeout(() => {
        uiClickAudio.pause();
      }, (endTime - startTime) * 1000);
    };

    if (uiClickAudio.readyState >= 1) {
      playSegment();
      return;
    }

    const handleLoadedMetadata = () => {
      uiClickAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      playSegment();
    };

    uiClickAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    uiClickAudio.load();
  }

  playJumpSound() {
    if (!this.soundEnabled) return;

    const jumpAudio = this.getJumpAudio();
    if (!jumpAudio) return;

    const startTime = 6.1;
    const endTime = 6.5;
    const playSegment = () => {
      window.clearTimeout(this.jumpTimeoutId);
      jumpAudio.pause();
      jumpAudio.currentTime = startTime;
      const playPromise = jumpAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.error("Failed to start jump sound:", error);
        });
      }
      this.jumpTimeoutId = window.setTimeout(() => {
        jumpAudio.pause();
      }, (endTime - startTime) * 1000);
    };

    if (jumpAudio.readyState >= 1) {
      playSegment();
      return;
    }

    const handleLoadedMetadata = () => {
      jumpAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      playSegment();
    };

    jumpAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    jumpAudio.load();
  }

  playBloomSound() {
    if (!this.soundEnabled) return;

    const bloomAudio = this.getBloomAudio();
    if (!bloomAudio) return;

    const startTime = 55;
    const endTime = 56;
    const playSegment = () => {
      window.clearTimeout(this.bloomTimeoutId);
      bloomAudio.pause();
      bloomAudio.currentTime = startTime;
      const playPromise = bloomAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.error("Failed to start bloom sound:", error);
        });
      }
      this.bloomTimeoutId = window.setTimeout(() => {
        bloomAudio.pause();
      }, (endTime - startTime) * 1000);
    };

    if (bloomAudio.readyState >= 1) {
      playSegment();
      return;
    }

    const handleLoadedMetadata = () => {
      bloomAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      playSegment();
    };

    bloomAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    bloomAudio.load();
  }

  playBloomBreakSound() {
    if (!this.soundEnabled) return;

    const bloomBreakAudio = this.getBloomBreakAudio();
    if (!bloomBreakAudio) return;

    const startTime = 65;
    const endTime = 66;
    const playSegment = () => {
      window.clearTimeout(this.bloomBreakTimeoutId);
      bloomBreakAudio.pause();
      bloomBreakAudio.currentTime = startTime;
      const playPromise = bloomBreakAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.error("Failed to start bloom break sound:", error);
        });
      }
      this.bloomBreakTimeoutId = window.setTimeout(() => {
        bloomBreakAudio.pause();
      }, (endTime - startTime) * 1000);
    };

    if (bloomBreakAudio.readyState >= 1) {
      playSegment();
      return;
    }

    const handleLoadedMetadata = () => {
      bloomBreakAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      playSegment();
    };

    bloomBreakAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    bloomBreakAudio.load();
  }

  playHeroDeathSound() {
    if (!this.soundEnabled) return;

    const heroDeathAudio = this.getHeroDeathAudio();
    if (!heroDeathAudio) return;

    const startTime = 65;
    const endTime = 66;
    const playSegment = () => {
      window.clearTimeout(this.heroDeathTimeoutId);
      heroDeathAudio.pause();
      heroDeathAudio.currentTime = startTime;
      const playPromise = heroDeathAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.error("Failed to start hero death sound:", error);
        });
      }
      this.heroDeathTimeoutId = window.setTimeout(() => {
        heroDeathAudio.pause();
      }, (endTime - startTime) * 1000);
    };

    if (heroDeathAudio.readyState >= 1) {
      playSegment();
      return;
    }

    const handleLoadedMetadata = () => {
      heroDeathAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      playSegment();
    };

    heroDeathAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    heroDeathAudio.load();
  }

  playWeaponPickupSound() {
    if (!this.soundEnabled) return;

    const weaponPickupAudio = this.getWeaponPickupAudio();
    if (!weaponPickupAudio) return;

    const startTime = 46;
    const endTime = 47;
    const playSegment = () => {
      window.clearTimeout(this.weaponPickupTimeoutId);
      weaponPickupAudio.pause();
      weaponPickupAudio.currentTime = startTime;
      const playPromise = weaponPickupAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.error("Failed to start weapon pickup sound:", error);
        });
      }
      this.weaponPickupTimeoutId = window.setTimeout(() => {
        weaponPickupAudio.pause();
      }, (endTime - startTime) * 1000);
    };

    if (weaponPickupAudio.readyState >= 1) {
      playSegment();
      return;
    }

    const handleLoadedMetadata = () => {
      weaponPickupAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      playSegment();
    };

    weaponPickupAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    weaponPickupAudio.load();
  }

  playOrbCastSound() {
    if (!this.soundEnabled) return;

    const orbCastAudio = this.getOrbCastAudio();
    if (!orbCastAudio) return;

    const startTime = 96.2;
    const endTime = 97;
    const playSegment = () => {
      window.clearTimeout(this.orbCastTimeoutId);
      orbCastAudio.pause();
      orbCastAudio.currentTime = startTime;
      const playPromise = orbCastAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.error("Failed to start orb cast sound:", error);
        });
      }
      this.orbCastTimeoutId = window.setTimeout(() => {
        orbCastAudio.pause();
      }, (endTime - startTime) * 1000);
    };

    if (orbCastAudio.readyState >= 1) {
      playSegment();
      return;
    }

    const handleLoadedMetadata = () => {
      orbCastAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      playSegment();
    };

    orbCastAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    orbCastAudio.load();
  }

  playVictorySound() {
    if (!this.soundEnabled) return;

    const victoryAudio = this.getVictoryAudio();
    if (!victoryAudio) return;

    victoryAudio.pause();
    victoryAudio.currentTime = 0;
    const playPromise = victoryAudio.play();
    if (playPromise?.catch) {
      playPromise.catch((error) => {
        console.error("Failed to start victory sound:", error);
      });
    }
  }

  getBackgroundTrack() {
    if (this.currentPage === "menu" || this.currentPage === "levels") {
      return mainMenuThemeTrack;
    }

    if (this.currentPage === "game" || this.currentPage === "lore") {
      if (Number(this.selectedLevel) === 1) {
        return level1ThemeTrack;
      }

      if (Number(this.selectedLevel) === 2) {
        return level2ThemeTrack;
      }

      if (Number(this.selectedLevel) === 3) {
        return level3ThemeTrack;
      }

      return mainMenuThemeTrack;
    }

    return null;
  }

  updateBackgroundMusic() {
    const backgroundAudio = this.getBackgroundAudio();
    if (!backgroundAudio) return;

    const nextTrack = this.soundEnabled ? this.getBackgroundTrack() : null;
    if (!nextTrack) {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
      this.activeBackgroundTrack = null;
      return;
    }

    if (this.activeBackgroundTrack !== nextTrack) {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
      backgroundAudio.src = nextTrack;
      backgroundAudio.load();
      this.activeBackgroundTrack = nextTrack;
    }

    const playPromise = backgroundAudio.play();
    if (playPromise?.catch) {
      playPromise.catch((error) => {
        console.error("Failed to start background music:", error);
      });
    }
  }
}

export default Router;
