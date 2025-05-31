import React from "react";
import Konva from "konva";
import { Group, Rect, Text, Image } from "react-konva";
import {
  TOWER_PANEL_WIDTH,
  TOWER_PANEL_HEIGHT,
  TOWER_PANEL_OFFSET_X,
  TOWER_PANEL_OFFSET_Y,
} from "../game/constants";
import { NORMAL_TOWER, SLOW_TOWER } from "../game/configs";
import { useTowerImg } from "../hooks/useTowerImg";
import type { Tower } from "../types/game";

const TOWER_OPTIONS = [NORMAL_TOWER, SLOW_TOWER];

interface Props {
  onDragStart: (
    e: Konva.KonvaEventObject<MouseEvent>,
    tower: Omit<Tower, "id" | "position" | "lastAttackTime">,
  ) => void;
  isDragging: boolean;
}

const TowerSelector: React.FC<Props> = ({ onDragStart, isDragging }) => {
  const towerAssetMap = useTowerImg();
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
          onMouseDown={(e) => onDragStart(e, tower)}
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            if (!stage) {
              return;
            }
            const container = stage.container();
            container.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => {
            if (isDragging) {
              return;
            }
            const stage = e.target.getStage();
            if (!stage) {
              return;
            }
            const container = stage.container();
            container.style.cursor = "default";
          }}
        >
          <Image
            y={30}
            image={towerAssetMap[tower.type]}
            width={20}
            height={20}
          />
          <Text
            x={20}
            y={35}
            text={`${tower.label}(${tower.cost}💰)`}
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
