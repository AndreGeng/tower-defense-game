import type { Monster, Tower, Position, SpecialEffect } from "../types/game";
import { GRID_SIZE } from "./constants";
import { WAVE_CONFIGS } from "./configs";

export const getValidSpecialEffect = (specialEffects: SpecialEffect[]) => {
  return specialEffects.filter((specialEffect) => {
    return (
      (specialEffect.applyTime || 0) + specialEffect.duration >= Date.now()
    );
  });
};

export const findTargetEffect = (
  specialEffects: SpecialEffect[],
  targetType: string,
) => {
  return getValidSpecialEffect(specialEffects).find(
    (specialEffect) => specialEffect.type === targetType,
  );
};

export const calculateNewPosition = (
  monster: Monster,
  path: Position[],
): [number, Position] => {
  let currentPathIndex = 0;
  // 找到怪物当前所在的路径点索引
  for (let i = monster.pathIndex; i < path.length - 1; i++) {
    const point = path[i];
    const dx = Math.abs(point.x - monster.position.x);
    const dy = Math.abs(point.y - monster.position.y);
    if (dx < GRID_SIZE && dy < GRID_SIZE) {
      currentPathIndex = i;
      break;
    }
  }

  // 如果找不到当前位置，说明怪物刚生成，使用第一个路径点
  if (currentPathIndex === -1) {
    const firstPoint = path[0];
    const dx = firstPoint.x - monster.position.x;
    const dy = firstPoint.y - monster.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < monster.speed) {
      return [0, firstPoint];
    }

    return [
      0,
      {
        x: monster.position.x + (dx / distance) * monster.speed,
        y: monster.position.y + (dy / distance) * monster.speed,
      },
    ];
  }

  // 如果已经到达最后一个路径点，则保持不动
  if (currentPathIndex === path.length - 1) {
    return [path.length - 1, monster.position];
  }

  // 获取下一个路径点
  const nextPoint = path[currentPathIndex + 1];
  const dx = nextPoint.x - monster.position.x;
  const dy = nextPoint.y - monster.position.y;

  let speed = monster.speed;
  const slowEffect = findTargetEffect(monster.specialEffects, "SLOW");
  if (slowEffect) {
    speed = speed * slowEffect.value;
  }
  // 如果距离小于移动速度，直接到达该点
  if (
    (dx !== 0 && Math.abs(dx) < speed) ||
    (dy !== 0 && Math.abs(dy) < speed)
  ) {
    return [currentPathIndex, nextPoint];
  }

  if (dx !== 0) {
    return [
      currentPathIndex,
      {
        x: monster.position.x + (dx > 0 ? speed : -speed),
        y: monster.position.y,
      },
    ];
  }

  // 否则按比例移动
  return [
    currentPathIndex,
    {
      x: monster.position.x,
      y: monster.position.y + (dy > 0 ? monster.speed : -monster.speed),
    },
  ];
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

let id = 0;
export const getId = () => {
  return ++id;
};

// 准备波次的怪物
export const prepareWaveMonsters = (waveIndex: number) => {
  if (waveIndex >= WAVE_CONFIGS.length) return [];

  const wave = WAVE_CONFIGS[waveIndex];
  const monsters: Array<Omit<Monster, "id" | "position">> = [];

  wave.monsters.forEach((config) => {
    for (let i = 0; i < config.count; i++) {
      monsters.push({
        type: config.type,
        hp: config.hp,
        maxHp: config.hp,
        speed: config.speed,
        damage: config.damage,
        width: config.width,
        height: config.height,
        slowEffect: 1,
        pathIndex: 0,
        gold: config.gold,
        specialEffects: [],
      });
    }
  });

  return monsters.sort(() => Math.random() - 0.5);
};
