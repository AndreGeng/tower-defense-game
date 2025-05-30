import React from "react";
import { Group, Image } from "react-konva";
import type { Tower as TowerType } from "../types/game";
import { useTowerImg } from "../hooks/useTowerImg";
import { GRID_SIZE } from "../game/constants";

interface Props {
  tower: TowerType;
}

const Tower: React.FC<Props> = ({ tower }) => {
  const towerAssetMap = useTowerImg();

  return (
    <Group
      x={tower.position.x - GRID_SIZE / 2}
      y={tower.position.y - GRID_SIZE / 2}
    >
      <Image
        image={towerAssetMap[tower.type]}
        width={GRID_SIZE}
        height={GRID_SIZE}
      />
    </Group>
  );
};

export default Tower;
