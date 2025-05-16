import type { Monster } from "../types/game";
import {
  MONSTER_WIDTH,
  MONSTER_HEIGHT,
  MONSTER_SPAWN_INTERVAL,
  NORMAL_MONSTER,
  ELITE_MONSTER,
} from "./constants";

export interface WaveConfig {
  monsters: (Pick<Monster, "hp" | "speed" | "damage" | "width" | "height"> & {
    count: number;
  })[];
  interval: number;
}

export const WAVE_CONFIGS: WaveConfig[] = [
  {
    monsters: [
      {
        count: 5,
        hp: NORMAL_MONSTER.HP,
        speed: NORMAL_MONSTER.SPEED,
        damage: NORMAL_MONSTER.DAMAGE,
        width: MONSTER_WIDTH,
        height: MONSTER_HEIGHT,
      },
      {
        count: 3,
        hp: ELITE_MONSTER.HP,
        speed: ELITE_MONSTER.SPEED,
        damage: ELITE_MONSTER.DAMAGE,
        width: MONSTER_WIDTH,
        height: MONSTER_HEIGHT,
      },
    ],
    interval: MONSTER_SPAWN_INTERVAL,
  },
];