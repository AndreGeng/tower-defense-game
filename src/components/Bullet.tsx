import React from "react";
import { Circle } from "react-konva";
import type { Bullet as BulletType, TowerVariantType } from "../types/game";

interface Props {
  bullet: BulletType;
  towerType: TowerVariantType;
}

const Bullet: React.FC<Props> = ({ bullet, towerType }) => {
  if (towerType === "NORMAL") {
    return (
      <Circle
        x={bullet.position.x}
        y={bullet.position.y}
        radius={4}
        fill="#FFD700"
      />
    );
  }
  return (
    <Circle
      x={bullet.position.x}
      y={bullet.position.y}
      radius={4}
      fill="#47A2E6"
    />
  );
};

export default Bullet;

