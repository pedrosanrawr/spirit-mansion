class Platform {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
  }
}

export function createPlatforms(platformConfigs = []) {
  return platformConfigs.map((config) => new Platform(config));
}

export default Platform;
