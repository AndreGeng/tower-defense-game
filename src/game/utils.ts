import type { Monster, Tower, Position } from "../types/game";
import { GRID_SIZE } from "./constants";

export const calculateNewPosition = (
  monster: Monster,
  path: Position[],
): Position => {
  // 找到怪物当前所在的路径点索引
  const currentPathIndex = path.findIndex((point) => {
    const dx = Math.abs(point.x - monster.position.x);
    const dy = Math.abs(point.y - monster.position.y);
    return dx < GRID_SIZE && dy < GRID_SIZE;
  });

  // 如果找不到当前位置，说明怪物刚生成，使用第一个路径点
  if (currentPathIndex === -1) {
    const firstPoint = path[0];
    const dx = firstPoint.x - monster.position.x;
    const dy = firstPoint.y - monster.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < monster.speed) {
      return firstPoint;
    }

    return {
      x: monster.position.x + (dx / distance) * monster.speed,
      y: monster.position.y + (dy / distance) * monster.speed,
    };
  }

  // 如果已经到达最后一个路径点，则保持不动
  if (currentPathIndex === path.length - 1) {
    return monster.position;
  }

  // 获取下一个路径点
  const nextPoint = path[currentPathIndex + 1];
  const dx = nextPoint.x - monster.position.x;
  const dy = nextPoint.y - monster.position.y;

  // 如果距离小于移动速度，直接到达该点
  if (
    (dx !== 0 && Math.abs(dx) < monster.speed) ||
    (dy !== 0 && Math.abs(dy) < monster.speed)
  ) {
    return nextPoint;
  }

  if (dx !== 0) {
    return {
      x: monster.position.x + (dx > 0 ? monster.speed : -monster.speed),
      y: monster.position.y,
    };
  }

  // 否则按比例移动
  return {
    x: monster.position.x,
    y: monster.position.y + (dy > 0 ? monster.speed : -monster.speed),
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
