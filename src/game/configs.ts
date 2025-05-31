import type { Monster, Tower } from "../types/game";
import { TowerVariant } from "../types/game";
import { MONSTER_WIDTH, MONSTER_HEIGHT, GRID_SIZE } from "./constants";

export interface WaveConfig {
  monsters: (Pick<
    Monster,
    "hp" | "speed" | "damage" | "gold" | "width" | "height" | "type"
  > & {
    count: number;
  })[];
  interval: number;
}

// 游戏状态常量
export const INITIAL_PLAYER_HEALTH = 10;
export const INITIAL_GOLD = 500;

// 怪物相关常量
export const MONSTER_SPAWN_INTERVAL = 1000;

// 怪物属性常量
export const NORMAL_MONSTER = {
  type: "NORMAL",
  hp: 100,
  speed: 1,
  damage: 1,
  gold: 10,
  width: MONSTER_WIDTH,
  height: MONSTER_HEIGHT,
} as const;

export const ELITE_MONSTER = {
  type: "ELITE",
  hp: 150,
  speed: 2,
  damage: 3,
  gold: 50,
  width: MONSTER_WIDTH,
  height: MONSTER_HEIGHT,
} as const;

// Tower属性常量
export const NORMAL_TOWER: Omit<Tower, "id" | "position" | "lastAttackTime"> = {
  type: TowerVariant.NORMAL,
  attackInterval: 300,
  damage: 10,
  cost: 100,
  range: 2.5 * GRID_SIZE,
  label: "蘑菇塔",
  speed: 5,
} as const;
export const SLOW_TOWER: Omit<Tower, "id" | "position" | "lastAttackTime"> = {
  type: TowerVariant.SLOW,
  attackInterval: 500,
  damage: 40,
  cost: 150,
  range: 1.5 * GRID_SIZE,
  label: "冰霜塔",
  speed: 3,
  specialEffect: {
    type: "SLOW",
    value: 0.5,
    duration: 1000,
  },
} as const;

export const WAVE_CONFIGS: WaveConfig[] = [
  {
    monsters: [
      {
        count: 5,
        ...NORMAL_MONSTER,
      },
      {
        count: 2,
        ...ELITE_MONSTER,
      },
    ],
    interval: MONSTER_SPAWN_INTERVAL,
  },
  {
    monsters: [
      {
        count: 20,
        ...NORMAL_MONSTER,
      },
      {
        count: 40,
        ...ELITE_MONSTER,
      },
    ],
    interval: MONSTER_SPAWN_INTERVAL / 2,
  },
];
