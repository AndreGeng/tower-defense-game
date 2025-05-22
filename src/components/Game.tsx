import React, { useState } from "react";
import { Stage, Layer, Rect, Line, Text, Circle, Group } from "react-konva";
import type { GameState, TowerVariantType } from "../types/game";
import MonsterComponent from "./Monster";
import TowerComponent from "./Tower";
import GameOverModal from "./GameOverModal";
import { useGameManager } from "../hooks/useGameManager";
import { GRID_SIZE, GAME_WIDTH, GAME_HEIGHT } from "../game/constants";

const initialGameState: GameState = {
  playerHealth: 10,
  gold: 100,
  wave: 1,
  monsters: [],
  towers: [],
  gameStatus: "playing",
};

import TowerSelector from "./TowerSelector";
import type { TowerOption } from "./TowerSelector";

const Game: React.FC = () => {
  const { gameState, path, setGameState } = useGameManager(initialGameState);

  // 渲染路径
  const renderPath = () => {
    if (!path.length) return null;

    const points = path.reduce((acc: number[], point) => {
      acc.push(point.x, point.y);
      return acc;
    }, []);

    return (
      <Line
        points={points}
        stroke="#FFB6C1" // 改为粉色
        strokeWidth={GRID_SIZE - 10}
        lineCap="round"
        lineJoin="round"
        opacity={0.8}
        dash={[]} // 移除虚线效果
      />
    );
  };

  // 渲染网格
  const renderGrid = () => {
    const gridLines = [];

    // 绘制垂直线
    for (let x = 0; x <= GAME_WIDTH; x += GRID_SIZE) {
      gridLines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, GAME_HEIGHT]}
          stroke="#FFE4E1"
          strokeWidth={1}
        />,
      );
    }

    // 绘制水平线
    for (let y = 0; y <= GAME_HEIGHT; y += GRID_SIZE) {
      gridLines.push(
        <Line
          key={`h${y}`}
          points={[0, y, GAME_WIDTH, y]}
          stroke="#FFE4E1"
          strokeWidth={1}
        />,
      );
    }

    return gridLines;
  };

  const [dragTower, setDragTower] = useState<{
    type: TowerVariantType;
    cost: number;
    range: number;
    x: number;
    y: number;
  } | null>(null);

  const handleTowerDragStart = (tower: TowerOption) => {
    if (gameState.gold < tower.cost) {
      return;
    }
    setDragTower({
      ...tower,
      x: 0,
      y: 0,
    });
  };

  const handleMouseMove = (e: any) => {
    if (!dragTower) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = Math.floor(pos.x / GRID_SIZE) * GRID_SIZE;
    const y = Math.floor(pos.y / GRID_SIZE) * GRID_SIZE;

    setDragTower({
      ...dragTower,
      x,
      y,
    });
  };

  const handleMouseUp = () => {
    if (!dragTower) return;

    // 检查是否有足够的金币
    if (gameState.gold < dragTower.cost) {
      setDragTower(null);
      return;
    }

    // 添加新的防御塔
    const newTower = {
      id: Date.now(),
      type: dragTower.type,
      position: { x: dragTower.x, y: dragTower.y },
      damage: dragTower.type === "NORMAL" ? 10 : 5,
      attackSpeed: 1,
      range: dragTower.range,
      cost: dragTower.cost,
      specialEffect:
        dragTower.type === "SLOW"
          ? { type: "slow" as const, value: 0.5, duration: 1000 }
          : undefined,
    };

    setGameState((prev) => ({
      ...prev,
      towers: [...prev.towers, newTower],
      gold: prev.gold - dragTower.cost,
    }));

    setDragTower(null);
  };

  return (
    <div
      className="mx-auto box-content w-[800px] border-2 border-pink-200 relative rounded-lg overflow-hidden"
      style={{
        height: `${GAME_HEIGHT}px`,
      }}
    >
      <Stage
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            fill="#FFF5EE" // 改为浅粉色背景
          />
          {renderGrid()}
          {renderPath()}
          {/* 状态栏背景 */}
          <Rect
            x={10}
            y={10}
            width={200}
            height={80}
            fill="#FFF0F5"
            cornerRadius={8}
            shadowColor="#FFB6C1"
            shadowBlur={5}
            shadowOffset={{ x: 2, y: 2 }}
          />
          {/* 状态文本 */}
          <Text
            x={20}
            y={20}
            text={`❤️ 生命值: ${gameState.playerHealth}`}
            fontSize={16}
            fill="#FF69B4"
            fontFamily="Arial"
          />
          <Text
            x={20}
            y={45}
            text={`💰 金币: ${gameState.gold}`}
            fontSize={16}
            fill="#FF69B4"
            fontFamily="Arial"
          />
          <Text
            x={20}
            y={70}
            text={`🌊 波数: ${gameState.wave}`}
            fontSize={16}
            fill="#FF69B4"
            fontFamily="Arial"
          />
          {gameState.monsters.map((monster) => (
            <MonsterComponent key={monster.id} monster={monster} />
          ))}
          {gameState.towers.map((tower) => (
            <TowerComponent key={tower.id} tower={tower} />
          ))}

          {/* 拖拽时显示攻击范围 */}
          {dragTower && (
            <>
              <Circle
                x={dragTower.x + 20}
                y={dragTower.y + 20}
                radius={dragTower.range}
                fill="rgba(255, 182, 193, 0.2)"
                stroke="#FFB6C1"
                strokeWidth={1}
                dash={[5, 5]}
              />
              <Group>
                <Circle
                  x={dragTower.x + 20}
                  y={dragTower.y + 20}
                  radius={20}
                  fill={dragTower.type === "NORMAL" ? "#FFB6C1" : "#DDA0DD"}
                  opacity={0.6}
                />
              </Group>
            </>
          )}

          <TowerSelector onDragStart={handleTowerDragStart} />
        </Layer>
      </Stage>
      <GameOverModal gameState={gameState} />
    </div>
  );
};

export default Game;
