class Router {
  constructor() {
    this.currentPage = 'menu';
    this.pages = {};
    this.selectedLevel = 1;
    this.soundEnabled = true;
    this.maxLevels = 3;
    this.storageKey = "spirit_mansion_progress_v1";
    this.unlockedLevels = this.loadUnlockedLevels();
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
}

export default Router;
