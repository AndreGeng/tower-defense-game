import React from 'react';
import { Circle, Group } from 'react-konva';
import type { Tower as TowerType } from '../types/game';

interface Props {
  tower: TowerType;
}

const Tower: React.FC<Props> = ({ tower }) => {
  const baseColor = tower.type === 'NORMAL' ? '#FF9999' : '#B19CD9';
  const accentColor = tower.type === 'NORMAL' ? '#FFB3B3' : '#C8B4E6';

  return (
    <Group>
      {/* 塔的主体 */}
      <Circle
        x={tower.position.x + 20}
        y={tower.position.y + 20}
        radius={20}
        fill={baseColor}
        shadowColor="#00000033"
        shadowBlur={5}
        shadowOffset={{ x: 2, y: 2 }}
      />
      {/* 装饰圆圈 */}
      <Circle
        x={tower.position.x + 20}
        y={tower.position.y + 20}
        radius={12}
        fill={accentColor}
      />
      {/* 高光效果 */}
      <Circle
        x={tower.position.x + 15}
        y={tower.position.y + 15}
        radius={5}
        fill="#FFFFFF88"
      />
    </Group>
  );
};

export default Tower;