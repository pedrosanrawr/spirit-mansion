export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function overlaps(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

export function resolvePlatformCollision(player, platforms, previousX, previousY) {
  player.onGround = false;
  platforms.forEach((platform) => {
    if (!overlaps(player, platform)) return;

    const previousBottom = previousY + player.height;
    const previousTop = previousY;
    const previousRight = previousX + player.width;
    const previousLeft = previousX;

    if (previousBottom <= platform.y && player.velocityY >= 0) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.onGround = true;
      return;
    }

    if (previousTop >= platform.y + platform.height && player.velocityY < 0) {
      player.y = platform.y + platform.height;
      player.velocityY = 0;
      return;
    }

    if (previousRight <= platform.x && player.velocityX > 0) {
      player.x = platform.x - player.width;
      player.velocityX = 0;
      return;
    }

    if (previousLeft >= platform.x + platform.width && player.velocityX < 0) {
      player.x = platform.x + platform.width;
      player.velocityX = 0;
    }
  });
}
