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
  resolveEntityPlatformCollision(player, platforms, previousX, previousY);
}

export function resolveEntityPlatformCollision(entity, platforms, previousX, previousY) {
  entity.onGround = false;
  platforms.forEach((platform) => {
    if (!overlaps(entity, platform)) return;

    const previousBottom = previousY + entity.height;
    const previousTop = previousY;
    const previousRight = previousX + entity.width;
    const previousLeft = previousX;

    if (previousBottom <= platform.y && entity.velocityY >= 0) {
      entity.y = platform.y - entity.height;
      entity.velocityY = 0;
      entity.onGround = true;
      return;
    }

    if (previousTop >= platform.y + platform.height && entity.velocityY < 0) {
      entity.y = platform.y + platform.height;
      entity.velocityY = 0;
      return;
    }

    if (previousRight <= platform.x && entity.velocityX > 0) {
      entity.x = platform.x - entity.width;
      entity.velocityX = 0;
      return;
    }

    if (previousLeft >= platform.x + platform.width && entity.velocityX < 0) {
      entity.x = platform.x + platform.width;
      entity.velocityX = 0;
    }
  });
}
