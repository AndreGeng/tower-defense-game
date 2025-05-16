import React from "react";
import { Stage, Layer, Rect, Line, Text } from "react-konva";
import type { GameState } from "../types/game";
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

const Game: React.FC = () => {
  const { gameState } = useGameManager(initialGameState);

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
      style={{
        height: `${GAME_HEIGHT}px`,
      }}
    >
      <Stage width={GAME_WIDTH} height={GAME_HEIGHT}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            fill="#FFF5F5"
          />
          {renderGrid()}
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
        </Layer>
      </Stage>
      <GameOverModal gameState={gameState} />
    </div>
  );
};

export default Game;
