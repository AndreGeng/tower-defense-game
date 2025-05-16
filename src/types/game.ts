// 怪物类型定义
export interface Monster {
  id: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  position: Position;
  slowEffect: number;
  width: number;
  height: number;
}

// 位置类型
export interface Position {
  x: number;
  y: number;
}

// 塔的类型枚举
export const TowerVariant = {
  NORMAL: "NORMAL",
  SLOW: "SLOW",
} as const;

// 塔的类型定义
export type TowerVariantType = (typeof TowerVariant)[keyof typeof TowerVariant];

// 塔类型定义
export interface Tower {
  id: number;
  type: TowerVariantType;
  position: Position;
  damage: number;
  attackSpeed: number;
  range: number;
  cost: number;
  specialEffect?: {
    type: "slow";
    value: number;
    duration: number;
  };
}

// 游戏状态
export interface GameState {
  playerHealth: number;
  gold: number;
  wave: number;
  monsters: Monster[];
  towers: Tower[];
  gameStatus: "playing" | "won" | "lost";
}

