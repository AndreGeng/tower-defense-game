import type { Position } from "../types/game";

// 游戏尺寸常量
export const GRID_SIZE = 40;
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 640;
export const GAME_COLUMNS = GAME_WIDTH / GRID_SIZE;
export const GAME_ROWS = GAME_HEIGHT / GRID_SIZE;

// 游戏状态常量
export const INITIAL_PLAYER_HEALTH = 10;
export const INITIAL_GOLD = 100;
export const INITIAL_WAVE = 1;
export const GAME_LOOP_FPS = 60;

// 怪物相关常量
export const MONSTER_WIDTH = 30;
export const MONSTER_HEIGHT = 30;
export const MONSTER_COLLISION_THRESHOLD = 5;
export const MONSTER_SPAWN_INTERVAL = 2000;

// 怪物属性常量
export const NORMAL_MONSTER = {
  HP: 100,
  SPEED: 5,
  DAMAGE: 1,
};

export const ELITE_MONSTER = {
  HP: 150,
  SPEED: 2.5,
  DAMAGE: 2,
};

// 怪物出生点和终点
export const SPAWN_POINT: Position = { x: 0, y: GAME_HEIGHT / 2 };
export const END_POINT: Position = { x: GAME_WIDTH, y: GAME_HEIGHT / 2 };

