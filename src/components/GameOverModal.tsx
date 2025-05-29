import React from "react";
import type { GameState } from "../types/game";

interface Props {
  gameState: GameState;
}

const GameOverModal: React.FC<Props> = ({ gameState }) => {
  if (gameState.gameStatus === "playing") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-32 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {gameState.gameStatus === "won" ? "游戏胜利！" : "游戏失败！"}
        </h2>
        <p className="mb-16 text-gray-600">
          {gameState.gameStatus === "won"
            ? "恭喜你成功击退了所有敌人！"
            : "很遗憾，请再接再厉！"}
        </p>
        <button
          className="bg-blue-500 text-white px-16 py-8 rounded hover:bg-blue-600 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          重新开始
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;

