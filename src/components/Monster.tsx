import React from "react";
import type { Monster as MonsterType } from "../types/game";

interface Props {
  monster: MonsterType;
}

const Monster: React.FC<Props> = ({ monster }) => {
  const healthPercentage = (monster.hp / monster.maxHp) * 100;

  return (
    <div
      className="absolute bg-red-500"
      style={{
        left: `${monster.position.x}px`,
        top: `${monster.position.y}px`,
        width: `${monster.width}px`,
        height: `${monster.height}px`,
      }}
    >
      <div className="absolute -top-2 w-full h-1 bg-gray-300">
        <div
          className="h-full bg-green-500"
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default Monster;

