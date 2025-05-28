import { Rect, Text, Group } from "react-konva";
import {
  INFO_PANEL_WIDTH,
  INFO_PANEL_HEIGHT,
  INFO_PANEL_OFFSET_X,
  INFO_PANEL_OFFSET_Y,
} from "../game/constants";
import { WAVE_CONFIGS } from "../game/configs";

interface InfoPanelProps {
  playerHealth: number;
  gold: number;
  wave: number;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  playerHealth,
  gold,
  wave,
}) => {
  return (
    <Group x={0} y={0}>
      {/* 状态栏背景 */}
      <Rect
        x={INFO_PANEL_OFFSET_X}
        y={INFO_PANEL_OFFSET_Y}
        width={INFO_PANEL_WIDTH}
        height={INFO_PANEL_HEIGHT}
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
        text={`❤️ 生命值: ${playerHealth}`}
        fontSize={16}
        fill="#FF69B4"
        fontFamily="Arial"
      />
      <Text
        x={20}
        y={45}
        text={`💰 金币: ${gold}`}
        fontSize={16}
        fill="#FF69B4"
        fontFamily="Arial"
      />
      <Text
        x={20}
        y={70}
        text={`🌊 波数: ${wave + 1}/${WAVE_CONFIGS.length}`}
        fontSize={16}
        fill="#FF69B4"
        fontFamily="Arial"
      />
    </Group>
  );
};
