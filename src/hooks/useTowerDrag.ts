import { useState } from "react";
import Konva from "konva";
import type { TowerOption } from "../components/TowerSelector";
import type { GameState } from "../types/game";
import {
  GRID_SIZE,
  GAME_WIDTH,
  GAME_HEIGHT,
  INFO_PANEL_OFFSET_X,
  INFO_PANEL_OFFSET_Y,
  INFO_PANEL_WIDTH,
  INFO_PANEL_HEIGHT,
  TOWER_PANEL_OFFSET_X,
  TOWER_PANEL_OFFSET_Y,
  TOWER_PANEL_WIDTH,
  TOWER_PANEL_HEIGHT,
} from "../game/constants";
import type { PathPoint } from "../game/path";
import { NORMAL_TOWER, SLOW_TOWER } from "../game/configs";

interface DragTower extends TowerOption {
  x: number;
  y: number;
  isValidPosition: boolean;
}

interface UseTowerDragProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  path: PathPoint[];
}

function getLeftOrTopBoundary(x: number = 0) {
  return Math.floor(x / GRID_SIZE) * GRID_SIZE;
}
function getRightOrBottomBoundary(x: number = 0) {
  return Math.ceil(x / GRID_SIZE) * GRID_SIZE;
}

export const useTowerDrag = ({
  gameState,
  setGameState,
  path,
}: UseTowerDragProps) => {
  const [dragTower, setDragTower] = useState<DragTower | null>(null);

  const handleDragStart = (
    e: Konva.KonvaEventObject<MouseEvent>,
    tower: TowerOption,
  ) => {
    if (gameState.gold < tower.cost) {
      return;
    }
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = "pointer";
    }
    setDragTower({
      ...tower,
      x: 0,
      y: 0,
      isValidPosition: false,
    });
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!dragTower) return;

    const stage = e.target.getStage();
    if (!stage) {
      return;
    }
    const pos = stage.getPointerPosition();

    // 计算网格对齐的位置（网格的左上角）
    const x = getLeftOrTopBoundary(pos?.x);
    const y = getLeftOrTopBoundary(pos?.y);

    // 检查位置是否有效
    const isOnPath = path.some(
      (point) =>
        getLeftOrTopBoundary(point.x) === getLeftOrTopBoundary(x) &&
        getLeftOrTopBoundary(point.y) === getLeftOrTopBoundary(y),
    );

    const hasTower = Object.keys(gameState.towerMap).some((towerId) => {
      const tower = gameState.towerMap[towerId];
      return tower.position.x === x && tower.position.y === y;
    });

    // 简化位置判断逻辑
    const isInCanvas =
      x >= 0 &&
      x <= GAME_WIDTH - GRID_SIZE &&
      y >= 0 &&
      y <= GAME_HEIGHT - GRID_SIZE;
    const isInPanel =
      (x >= getLeftOrTopBoundary(INFO_PANEL_OFFSET_X) &&
        x <= getRightOrBottomBoundary(INFO_PANEL_OFFSET_X + INFO_PANEL_WIDTH) &&
        y >= getLeftOrTopBoundary(INFO_PANEL_OFFSET_Y) &&
        y <=
          getRightOrBottomBoundary(INFO_PANEL_OFFSET_Y + INFO_PANEL_HEIGHT)) ||
      (x >= getLeftOrTopBoundary(TOWER_PANEL_OFFSET_X) &&
        x <=
          getRightOrBottomBoundary(TOWER_PANEL_OFFSET_X + TOWER_PANEL_WIDTH) &&
        y >= getLeftOrTopBoundary(TOWER_PANEL_OFFSET_Y) &&
        y <=
          getRightOrBottomBoundary(TOWER_PANEL_OFFSET_Y + TOWER_PANEL_HEIGHT));

    // 只判断基本的位置限制
    const isValidPosition = isInCanvas && !isInPanel && !isOnPath && !hasTower;

    setDragTower({
      ...dragTower,
      x,
      y,
      isValidPosition,
    });
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = "default";
    }
    if (!dragTower) return;

    // 检查是否有足够的金币
    if (gameState.gold < dragTower.cost) {
      setDragTower(null);
      return;
    }

    // 只在有效位置时才放置塔
    if (dragTower.isValidPosition) {
      const newId = Date.now();
      // 添加新的防御塔
      const newTower = {
        id: newId,
        type: dragTower.type,
        position: {
          x: dragTower.x + GRID_SIZE / 2,
          y: dragTower.y + GRID_SIZE / 2,
        },
        damage:
          dragTower.type === "NORMAL" ? NORMAL_TOWER.DAMAGE : SLOW_TOWER.DAMAGE,
        attackInterval:
          dragTower.type === "NORMAL"
            ? NORMAL_TOWER.ATTACK_INTERVAL
            : SLOW_TOWER.ATTACK_INTERVAL,
        lastAttackTime: 0,
        range: dragTower.range,
        cost: dragTower.cost,
        specialEffect:
          dragTower.type === "SLOW"
            ? { type: "slow" as const, value: 0.5, duration: 1000 }
            : undefined,
      };

      setGameState((prev) => ({
        ...prev,
        towerMap: {
          ...prev.towerMap,
          [newId]: newTower,
        },
        gold: prev.gold - dragTower.cost,
      }));
    }

    setDragTower(null);
  };

  return {
    dragTower,
    handleDragStart,
    handleMouseMove,
    handleMouseUp,
  };
};
