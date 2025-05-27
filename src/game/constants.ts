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

// 怪物相关常量
export const MONSTER_WIDTH = 20;
export const MONSTER_HEIGHT = 20;
export const MONSTER_COLLISION_THRESHOLD = 5;
export const MONSTER_SPAWN_INTERVAL = 2000;

// 面板相关常量
export const INFO_PANEL_WIDTH = 150;
export const INFO_PANEL_HEIGHT = 80;
export const INFO_PANEL_OFFSET_X = 10;
export const INFO_PANEL_OFFSET_Y = 10;

export const TOWER_PANEL_WIDTH = 150;
export const TOWER_PANEL_HEIGHT = 80;
export const TOWER_PANEL_OFFSET_X = GAME_WIDTH - TOWER_PANEL_WIDTH - 10;
export const TOWER_PANEL_OFFSET_Y = 10;

// 怪物属性常量
export const NORMAL_MONSTER = {
  HP: 100,
  SPEED: 3,
  DAMAGE: 1,
};

export const ELITE_MONSTER = {
  HP: 150,
  SPEED: 6,
  DAMAGE: 2,
};
