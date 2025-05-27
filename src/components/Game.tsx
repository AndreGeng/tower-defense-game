import React from "react";
import { Stage, Layer, Rect, Line, Text } from "react-konva";
import type { GameState } from "../types/game";
import MonsterComponent from "./Monster";
import TowerComponent from "./Tower";
import GameOverModal from "./GameOverModal";
import { useGameManager } from "../hooks/useGameManager";
import {
  GRID_SIZE,
  GAME_WIDTH,
  GAME_HEIGHT,
  INFO_PANEL_WIDTH,
  INFO_PANEL_HEIGHT,
  INFO_PANEL_OFFSET_X,
  INFO_PANEL_OFFSET_Y,
} from "../game/constants";
import { WAVE_CONFIGS } from "../game/configs";
import { useTowerDrag } from "../hooks/useTowerDrag";
import { Group, Circle } from "react-konva";

const initialGameState: GameState = {
  playerHealth: 10,
  gold: 500,
  wave: 0,
  monstersToSpawn: prepareWaveMonsters(0),
  lastSpawnTime: 0,
  monsters: [],
  towers: [],
  gameStatus: "playing",
};

import TowerSelector from "./TowerSelector";
import { prepareWaveMonsters } from "../game/utils";

const Game: React.FC = () => {
  const { gameState, path, setGameState } = useGameManager(initialGameState);
  const { dragTower, handleDragStart, handleMouseMove, handleMouseUp } =
    useTowerDrag({
      gameState,
      setGameState,
      path,
    });

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

  return (
    <div
      className="mx-auto box-content w-[800px] border-2 border-pink-200 relative rounded-lg overflow-hidden"
      style={{ height: `${GAME_HEIGHT}px` }}
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
            x={INFO_PANEL_OFFSET_X}
            y={INFO_PANEL_OFFSET_Y}
            width={INFO_PANEL_WIDTH}
            height={INFO_PANEL_HEIGHT}
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
            text={`🌊 波数: ${gameState.wave + 1}/${WAVE_CONFIGS.length}`}
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
          {dragTower && (
            <Group x={dragTower.x} y={dragTower.y}>
              {/* 攻击范围预览 */}
              <Circle
                radius={dragTower.range}
                fill={dragTower.isValidPosition ? "#90EE90" : "#FFB6C1"}
                opacity={0.2}
              />
              {/* 半透明的塔预览 */}
              <Text
                text={dragTower.emoji}
                fontSize={30}
                align="center"
                width={GRID_SIZE}
                height={GRID_SIZE}
                opacity={0.6}
                verticalAlign="middle"
              />
            </Group>
          )}
          <TowerSelector onDragStart={handleDragStart} />
        </Layer>
      </Stage>
      <GameOverModal gameState={gameState} />
    </div>
  );
};

export default Game;
