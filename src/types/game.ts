// 特效类型定义
export interface SpecialEffect {
  type: "SLOW";
  value: number;
  duration: number;
  applyTime?: number;
}
// 怪物类型定义
export interface Monster {
  id: number;
  type: "NORMAL" | "ELITE";
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  position: Position;
  slowEffect: number;
  width: number;
  height: number;
  pathIndex: number;
  gold: number;
  specialEffects: SpecialEffect[];
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
  label: string;
  type: TowerVariantType;
  position: Position;
  damage: number;
  range: number;
  cost: number;
  attackInterval: number;
  lastAttackTime: number;
  // 子弹速度
  speed: number;
  specialEffect?: SpecialEffect;
}

// 游戏状态
// 子弹类型定义
export interface Bullet {
  id: number;
  position: Position;
  targetMonsterId: number;
  damage: number;
  speed: number;
  towerId: number;
}

// 在 GameState 中添加子弹数组
export interface GameState {
  playerHealth: number;
  gold: number;
  wave: number;
  lastSpawnTime: number;
  gameStatus: "playing" | "won" | "lost";
  monstersToSpawn: Omit<Monster, "id" | "position">[];
  monsterMap: Record<string, Monster>;
  towerMap: Record<string, Tower>;
  bulletMap: Record<string, Bullet>;
}
