import type { Monster, Tower, Position } from "../types/game";
import { END_POINT } from "./constants";

export const calculateNewPosition = (monster: Monster): Position => {
  const dx = END_POINT.x - monster.position.x;
  const dy = END_POINT.y - monster.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < monster.speed) {
    return END_POINT;
  }

  const vx = (dx / distance) * monster.speed;
  const vy = (dy / distance) * monster.speed;

  return {
    x: monster.position.x + vx,
    y: monster.position.y + vy,
  };
};

export const findTargetMonster = (
  tower: Tower,
  monsters: Monster[],
): Monster | undefined => {
  return monsters.find((monster) => {
    const distance = Math.sqrt(
      Math.pow(tower.position.x - monster.position.x, 2) +
        Math.pow(tower.position.y - monster.position.y, 2),
    );
    return distance <= tower.range;
  });
};