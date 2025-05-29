import type { Monster } from "../types/game";
import { MONSTER_WIDTH, MONSTER_HEIGHT } from "./constants";

export interface WaveConfig {
  monsters: (Pick<
    Monster,
    "hp" | "speed" | "damage" | "gold" | "width" | "height"
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
  HP: 100,
  SPEED: 1,
  DAMAGE: 1,
  GOLD: 10,
};

export const ELITE_MONSTER = {
  HP: 150,
  SPEED: 2,
  DAMAGE: 3,
  GOLD: 50,
};

// Tower属性常量
export const NORMAL_TOWER = {
  ATTACK_INTERVAL: 300,
  SPEED: 3,
  DAMAGE: 10,
};
export const SLOW_TOWER = {
  ATTACK_INTERVAL: 500,
  SPEED: 3,
  DAMAGE: 40,
};

export const WAVE_CONFIGS: WaveConfig[] = [
  {
    monsters: [
      {
        count: 5,
        hp: NORMAL_MONSTER.HP,
        speed: NORMAL_MONSTER.SPEED,
        damage: NORMAL_MONSTER.DAMAGE,
        gold: NORMAL_MONSTER.GOLD,
        width: MONSTER_WIDTH,
        height: MONSTER_HEIGHT,
      },
      {
        count: 2,
        hp: ELITE_MONSTER.HP,
        speed: ELITE_MONSTER.SPEED,
        damage: ELITE_MONSTER.DAMAGE,
        gold: ELITE_MONSTER.GOLD,
        width: MONSTER_WIDTH,
        height: MONSTER_HEIGHT,
      },
    ],
    interval: MONSTER_SPAWN_INTERVAL,
  },
  {
    monsters: [
      {
        count: 20,
        hp: NORMAL_MONSTER.HP,
        speed: NORMAL_MONSTER.SPEED,
        damage: NORMAL_MONSTER.DAMAGE,
        gold: NORMAL_MONSTER.GOLD,
        width: MONSTER_WIDTH,
        height: MONSTER_HEIGHT,
      },
      {
        count: 40,
        hp: ELITE_MONSTER.HP,
        speed: ELITE_MONSTER.SPEED,
        damage: ELITE_MONSTER.DAMAGE,
        width: MONSTER_WIDTH,
        height: MONSTER_HEIGHT,
        gold: ELITE_MONSTER.GOLD,
      },
    ],
    interval: MONSTER_SPAWN_INTERVAL / 2,
  },
];
