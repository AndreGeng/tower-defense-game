import React from "react";
import { Group, Rect, Text } from "react-konva";
import type { TowerVariantType } from "../types/game";
import {
  TOWER_PANEL_WIDTH,
  TOWER_PANEL_HEIGHT,
  TOWER_PANEL_OFFSET_X,
  TOWER_PANEL_OFFSET_Y,
} from "../game/constants";

export interface TowerOption {
  type: TowerVariantType;
  cost: number;
  range: number;
  emoji: string; // 添加 emoji 属性
  label: string;
}

const TOWER_OPTIONS: TowerOption[] = [
  { type: "NORMAL", cost: 100, range: 120, emoji: "🎯", label: "老爸" }, // 普通塔用靶心表示
  { type: "SLOW", cost: 150, range: 100, emoji: "❄️", label: "老妈" }, // 减速塔用雪花表示
];

interface Props {
  onDragStart: (tower: TowerOption) => void;
}

const TowerSelector: React.FC<Props> = ({ onDragStart }) => {
  return (
    <Group x={TOWER_PANEL_OFFSET_X} y={TOWER_PANEL_OFFSET_Y}>
      {/* 面板背景 */}
      <Rect
        width={TOWER_PANEL_WIDTH}
        height={TOWER_PANEL_HEIGHT}
        fill="#FFF0F5"
        cornerRadius={8}
        shadowColor="#FFB6C1"
        shadowBlur={5}
        shadowOffset={{ x: 2, y: 2 }}
      />
      {/* 标题 */}
      <Text
        x={10}
        y={10}
        text="防御塔"
        fontSize={16}
        fill="#FF69B4"
        fontFamily="Arial"
      />
      {/* 塔的选项 */}
      {TOWER_OPTIONS.map((tower, index) => (
        <Group
          key={tower.type}
          x={10}
          y={index * 25}
          onMouseDown={() => onDragStart(tower)}
        >
          <Text
            y={35}
            text={`${tower.emoji} ${tower.label}(${tower.cost}💰)`}
            fontSize={16}
            fill="#FF69B4"
            align="center"
          />
        </Group>
      ))}
    </Group>
  );
};

export default TowerSelector;
