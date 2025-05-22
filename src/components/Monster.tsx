import React from "react";
import { Rect, Circle } from "react-konva";
import type { Monster as MonsterType } from "../types/game";

interface Props {
  monster: MonsterType;
}

const Monster: React.FC<Props> = ({ monster }) => {
  return (
    <React.Fragment>
      {/* 怪物主体 - 使用圆形代替方形,增加可爱度 */}
      <Circle
        x={monster.position.x}
        y={monster.position.y}
        radius={monster.width / 2}
        fill="#FF69B4"
        shadowColor="#FF1493"
        shadowBlur={5}
        shadowOffset={{ x: 2, y: 2 }}
      />
      {/* 血条背景 */}
      <Rect
        x={monster.position.x - monster.width / 2}
        y={monster.position.y - monster.height / 2 - 10}
        width={monster.width}
        height={4}
        fill="#FFE4E1"
        cornerRadius={2}
      />
      {/* 血条 */}
      <Rect
        x={monster.position.x - monster.width / 2}
        y={monster.position.y - monster.height / 2 - 10}
        width={monster.width * (monster.hp / monster.maxHp)}
        height={4}
        fill="#FF69B4"
        cornerRadius={2}
      />
    </React.Fragment>
  );
};

export default Monster;
