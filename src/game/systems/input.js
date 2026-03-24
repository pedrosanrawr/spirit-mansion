class InputSystem {
  constructor(p, constants) {
    this.p = p;
    this.constants = constants;
    this.jumpWasDown = false;
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.swordRequested = false;
    this.orbRequested = false;
  }

  reset() {
    this.jumpWasDown = false;
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.swordRequested = false;
    this.orbRequested = false;
  }

  keyPressed(key) {
    if (key === "j" || key === "J" || key === "k" || key === "K") {
      this.swordRequested = true;
    }
    if (key === "l" || key === "L") {
      this.orbRequested = true;
    }
    if (key === " " || key === "ArrowUp" || key === "w" || key === "W") {
      this.jumpBufferTimer = this.constants.jumpBufferTime;
    }
  }

  applyHorizontalMovement(player, deltaSeconds) {
    const leftDown = this.p.keyIsDown(this.p.LEFT_ARROW) || this.p.keyIsDown(65);
    const rightDown = this.p.keyIsDown(this.p.RIGHT_ARROW) || this.p.keyIsDown(68);
    const targetDirection = (rightDown ? 1 : 0) - (leftDown ? 1 : 0);
    const controlMultiplier = player.onGround ? 1 : this.constants.airControl;
    const accel = this.constants.groundAcceleration * controlMultiplier * deltaSeconds;
    const decel = this.constants.groundDeceleration * deltaSeconds;
    const targetVelocityX = targetDirection * this.constants.moveSpeed;

    if (targetDirection !== 0) {
      player.facing = targetDirection;
      if (player.velocityX < targetVelocityX) {
        player.velocityX = Math.min(player.velocityX + accel, targetVelocityX);
      } else if (player.velocityX > targetVelocityX) {
        player.velocityX = Math.max(player.velocityX - accel, targetVelocityX);
      }
    } else if (player.velocityX > 0) {
      player.velocityX = Math.max(player.velocityX - decel, 0);
    } else if (player.velocityX < 0) {
      player.velocityX = Math.min(player.velocityX + decel, 0);
    }
  }

  applyJumpLogic(player, deltaSeconds) {
    const jumpDown = this.p.keyIsDown(this.p.UP_ARROW) || this.p.keyIsDown(87) || this.p.keyIsDown(32);

    if (player.onGround) {
      this.coyoteTimer = this.constants.coyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaSeconds);
    }

    if (jumpDown && !this.jumpWasDown) {
      this.jumpBufferTimer = this.constants.jumpBufferTime;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - deltaSeconds);
    }

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      player.velocityY = -this.constants.jumpStrength;
      player.onGround = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }

    this.jumpWasDown = jumpDown;
  }

  consumeSwordRequest() {
    const value = this.swordRequested;
    this.swordRequested = false;
    return value;
  }

  consumeOrbRequest() {
    const value = this.orbRequested;
    this.orbRequested = false;
    return value;
  }
}

export default InputSystem;
