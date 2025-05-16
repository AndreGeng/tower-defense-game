import React from "react";
import { Rect } from 'react-konva';
import type { Monster as MonsterType } from "../types/game";

interface Props {
  monster: MonsterType;
}

const Monster: React.FC<Props> = ({ monster }) => {
  return (
    <React.Fragment>
      {/* 怪物主体 */}
      <Rect
        x={monster.position.x}
        y={monster.position.y}
        width={monster.width}
        height={monster.height}
        fill="#ef4444"
      />
      {/* 血条背景 */}
      <Rect
        x={monster.position.x}
        y={monster.position.y - 8}
        width={monster.width}
        height={4}
        fill="#d1d5db"
      />
      {/* 血条 */}
      <Rect
        x={monster.position.x}
        y={monster.position.y - 8}
        width={monster.width * (monster.hp / monster.maxHp)}
        height={4}
        fill="#22c55e"
      />
    </React.Fragment>
  );
};

export default Monster;

