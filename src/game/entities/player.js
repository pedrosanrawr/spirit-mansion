class Player {
  constructor(spawn, constants) {
    this.constants = constants;
    this.spawn = { ...spawn };
    this.resetToSpawn();
  }

  resetToSpawn() {
    this.x = this.spawn.x;
    this.y = this.spawn.y;
    this.width = this.constants.playerWidth;
    this.height = this.constants.playerHeight;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.facing = 1;
    this.hearts = 3;
    this.maxHearts = 3;
    this.checkpointX = this.spawn.x;
    this.checkpointY = this.spawn.y;
    this.invulnerableTimer = 0;
    this.hasSword = false;
    this.hasOrbSigil = false;
    this.isGrown = false;
    this.swordCooldown = 0;
    this.orbCooldown = 0;
  }

  updateCooldowns(deltaSeconds) {
    this.swordCooldown = Math.max(0, this.swordCooldown - deltaSeconds);
    this.orbCooldown = Math.max(0, this.orbCooldown - deltaSeconds);
    this.invulnerableTimer = Math.max(0, this.invulnerableTimer - deltaSeconds);
  }

  respawnAtCheckpoint() {
    this.x = this.checkpointX;
    this.y = this.checkpointY;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  updateCheckpoint() {
    if (this.onGround && this.x > this.checkpointX + 55) {
      this.checkpointX = this.x;
      this.checkpointY = this.y;
    }
  }

  applyPickup(type) {
    if (type === "spiritBloom" && !this.isGrown) {
      const previousHeight = this.height;
      this.isGrown = true;
      this.width = Math.floor(this.constants.playerWidth * 1.25);
      this.height = Math.floor(this.constants.playerHeight * 1.25);
      // Keep feet position stable when changing size.
      this.y -= this.height - previousHeight;
    }
    if (type === "moonBlade") {
      this.hasSword = true;
    }
    if (type === "orbSigil") {
      this.hasOrbSigil = true;
    }
  }

  resetPowerStateAfterDeath() {
    this.hearts = 3;
    this.maxHearts = 3;
    this.hasSword = false;
    this.hasOrbSigil = false;
    this.isGrown = false;
    this.width = this.constants.playerWidth;
    this.height = this.constants.playerHeight;
  }

  shrinkFromBloom() {
    if (!this.isGrown) return;
    const previousHeight = this.height;
    this.isGrown = false;
    this.width = this.constants.playerWidth;
    this.height = this.constants.playerHeight;
    this.y += previousHeight - this.height;
  }
}

export default Player;
