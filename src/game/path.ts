import type { Position } from "../types/game";
import { GRID_SIZE } from "./constants";

export interface PathPoint extends Position {
  direction: "right" | "down" | "left" | "up";
}

// 获取网格中心点坐标
const getGridCenter = (gridX: number, gridY: number): Position => ({
  x: gridX * GRID_SIZE + GRID_SIZE / 2,
  y: gridY * GRID_SIZE + GRID_SIZE / 2,
});

// 定义几种预设的路径模式
const PATH_PATTERNS = [
  // 1. 基础蛇形路径
  [
    { x: 2, y: 5 },
    { x: 6, y: 5 },
    { x: 6, y: 8 },
    { x: 10, y: 8 },
    { x: 10, y: 5 },
    { x: 14, y: 5 },
    { x: 14, y: 8 },
    { x: 18, y: 8 },
  ],
  // 2. 双U形路径
  [
    { x: 2, y: 5 },
    { x: 2, y: 9 },
    { x: 8, y: 9 },
    { x: 8, y: 5 },
    { x: 12, y: 5 },
    { x: 12, y: 9 },
    { x: 18, y: 9 },
    { x: 18, y: 5 },
  ],
  // 3. 迷宫形路径
  [
    { x: 2, y: 5 },
    { x: 16, y: 5 },
    { x: 16, y: 7 },
    { x: 4, y: 7 },
    { x: 4, y: 9 },
    { x: 14, y: 9 },
    { x: 14, y: 6 },
    { x: 18, y: 6 },
  ],
  // 4. 之字形路径
  [
    { x: 2, y: 5 },
    { x: 6, y: 5 },
    { x: 6, y: 7 },
    { x: 10, y: 7 },
    { x: 10, y: 9 },
    { x: 14, y: 9 },
    { x: 14, y: 7 },
    { x: 18, y: 7 },
  ],
  // 5. 环形路径
  [
    { x: 2, y: 7 },
    { x: 6, y: 7 },
    { x: 6, y: 5 },
    { x: 14, y: 5 },
    { x: 14, y: 9 },
    { x: 8, y: 9 },
    { x: 8, y: 7 },
    { x: 18, y: 7 },
  ],
  // 6. 双环形路径
  [
    { x: 2, y: 7 },
    { x: 5, y: 7 },
    { x: 5, y: 5 },
    { x: 9, y: 5 },
    { x: 9, y: 9 },
    { x: 5, y: 9 },
    { x: 5, y: 7 },
    { x: 13, y: 7 },
    { x: 13, y: 5 },
    { x: 17, y: 5 },
    { x: 17, y: 9 },
    { x: 13, y: 9 },
    { x: 13, y: 7 },
    { x: 18, y: 7 },
  ],
  // 7. 螺旋形路径
  [
    { x: 2, y: 7 },
    { x: 16, y: 7 },
    { x: 16, y: 5 },
    { x: 4, y: 5 },
    { x: 4, y: 9 },
    { x: 14, y: 9 },
    { x: 14, y: 6 },
    { x: 18, y: 6 },
  ],
  // 8. 交叉形路径
  [
    { x: 2, y: 5 },
    { x: 8, y: 5 },
    { x: 8, y: 9 },
    { x: 12, y: 9 },
    { x: 12, y: 5 },
    { x: 18, y: 5 },
  ],
  // 9. 复杂蛇形路径
  [
    { x: 2, y: 5 },
    { x: 4, y: 5 },
    { x: 4, y: 9 },
    { x: 8, y: 9 },
    { x: 8, y: 5 },
    { x: 12, y: 5 },
    { x: 12, y: 9 },
    { x: 16, y: 9 },
    { x: 16, y: 5 },
    { x: 18, y: 5 },
  ],
  // 10. 方块迷宫路径
  [
    { x: 2, y: 7 },
    { x: 6, y: 7 },
    { x: 6, y: 5 },
    { x: 10, y: 5 },
    { x: 10, y: 9 },
    { x: 14, y: 9 },
    { x: 14, y: 5 },
    { x: 18, y: 5 },
  ],
  // 11. 双折线路径
  [
    { x: 2, y: 5 },
    { x: 8, y: 5 },
    { x: 8, y: 9 },
    { x: 12, y: 9 },
    { x: 12, y: 5 },
    { x: 18, y: 5 },
  ],
  // 12. 复杂迷宫路径
  [
    { x: 2, y: 7 },
    { x: 6, y: 7 },
    { x: 6, y: 5 },
    { x: 12, y: 5 },
    { x: 12, y: 9 },
    { x: 8, y: 9 },
    { x: 8, y: 7 },
    { x: 14, y: 7 },
    { x: 14, y: 5 },
    { x: 18, y: 5 },
  ],
  // 13. 对称Z字形路径
  [
    { x: 2, y: 5 },
    { x: 8, y: 5 },
    { x: 8, y: 7 },
    { x: 12, y: 7 },
    { x: 12, y: 9 },
    { x: 18, y: 9 },
  ],
  // 14. 双层路径
  [
    { x: 2, y: 5 },
    { x: 16, y: 5 },
    { x: 16, y: 7 },
    { x: 4, y: 7 },
    { x: 4, y: 9 },
    { x: 18, y: 9 },
  ],
  // 15. 复杂交叉路径
  [
    { x: 2, y: 7 },
    { x: 8, y: 7 },
    { x: 8, y: 5 },
    { x: 12, y: 5 },
    { x: 12, y: 9 },
    { x: 16, y: 9 },
    { x: 16, y: 7 },
    { x: 18, y: 7 },
  ],
  // 16. 阶梯形路径
  [
    { x: 2, y: 5 },
    { x: 6, y: 5 },
    { x: 6, y: 6 },
    { x: 10, y: 6 },
    { x: 10, y: 7 },
    { x: 14, y: 7 },
    { x: 14, y: 8 },
    { x: 18, y: 8 },
  ],
  // 17. 双向交错路径
  [
    { x: 2, y: 5 },
    { x: 6, y: 5 },
    { x: 6, y: 9 },
    { x: 10, y: 9 },
    { x: 10, y: 5 },
    { x: 14, y: 5 },
    { x: 14, y: 9 },
    { x: 18, y: 9 },
  ],
  // 18. 复杂环形路径
  [
    { x: 2, y: 7 },
    { x: 8, y: 7 },
    { x: 8, y: 5 },
    { x: 14, y: 5 },
    { x: 14, y: 9 },
    { x: 6, y: 9 },
    { x: 6, y: 7 },
    { x: 16, y: 7 },
    { x: 18, y: 7 },
  ],
  // 19. 多转折路径
  [
    { x: 2, y: 5 },
    { x: 6, y: 5 },
    { x: 6, y: 7 },
    { x: 10, y: 7 },
    { x: 10, y: 5 },
    { x: 14, y: 5 },
    { x: 14, y: 9 },
    { x: 18, y: 9 },
  ],
];

// 生成路径
export const generatePath = (): PathPoint[] => {
  const path: PathPoint[] = [];

  // 随机选择一个路径模式
  const pattern =
    PATH_PATTERNS[Math.floor(Math.random() * PATH_PATTERNS.length)];

  // 根据选择的模式生成路径点
  for (let i = 0; i < pattern.length - 1; i++) {
    const current = pattern[i];
    const next = pattern[i + 1];

    // 计算两点之间需要生成的路径点
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    // 确定移动方向
    let direction: PathPoint["direction"];
    if (dx > 0) direction = "right";
    else if (dx < 0) direction = "left";
    else if (dy > 0) direction = "down";
    else direction = "up";

    // 生成两点之间的路径
    for (let step = 0; step <= steps; step++) {
      const progress = step / steps;
      const x = Math.round(current.x + dx * progress);
      const y = Math.round(current.y + dy * progress);

      const pos = getGridCenter(x, y);
      path.push({
        x: pos.x,
        y: pos.y,
        direction,
      });
    }
  }

  // 确保路径不重复添加相同的点
  const uniquePath = path.filter(
    (point, index, self) =>
      index === 0 ||
      point.x !== self[index - 1].x ||
      point.y !== self[index - 1].y,
  );

  return uniquePath;
};
