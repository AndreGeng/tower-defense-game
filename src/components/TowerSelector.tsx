import React from "react";
import { Group, Circle, Text, Ring } from "react-konva";
import type { TowerVariantType } from "../types/game";

export interface TowerOption {
  type: TowerVariantType;
  cost: number;
  range: number;
}

const TOWER_OPTIONS: TowerOption[] = [
  { type: "NORMAL", cost: 100, range: 120 },
  { type: "SLOW", cost: 150, range: 100 },
];

interface Props {
  onDragStart: (tower: TowerOption) => void;
}

const TowerSelector: React.FC<Props> = ({ onDragStart }) => {
  return (
    <Group x={650} y={10}>
      <Circle
        width={120}
        height={160}
        fill="#FFF0F5"
        cornerRadius={8}
        shadowColor="#FFB6C1"
        shadowBlur={5}
      />
      <Text
        x={10}
        y={10}
        text="防御塔"
        fontSize={16}
        fill="#FF69B4"
        fontFamily="Arial"
      />
      {TOWER_OPTIONS.map((tower, index) => (
        <Group
          key={tower.type}
          x={20}
          y={40 + index * 60}
          draggable
          onDragStart={() => onDragStart(tower)}
        >
          <Circle
            radius={20}
            fill={tower.type === "NORMAL" ? "#FFB6C1" : "#DDA0DD"}
          />
          <Text
            x={45}
            y={-10}
            text={`${tower.type === "NORMAL" ? "普通" : "减速"} 💰${tower.cost}`}
            fontSize={14}
            fill="#FF69B4"
          />
        </Group>
      ))}
    </Group>
  );
};

export default TowerSelector;

