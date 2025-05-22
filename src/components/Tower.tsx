import React from 'react';
import { Circle, Group, Star } from 'react-konva';
import type { Tower as TowerType } from '../types/game';

interface Props {
  tower: TowerType;
}

const Tower: React.FC<Props> = ({ tower }) => {
  const baseColor = tower.type === 'NORMAL' ? '#FFB6C1' : '#DDA0DD';
  const accentColor = tower.type === 'NORMAL' ? '#FFC0CB' : '#EE82EE';

  return (
    <Group>
      {/* 塔的主体 - 使用更柔和的粉色系 */}
      <Circle
        x={tower.position.x + 20}
        y={tower.position.y + 20}
        radius={20}
        fill={baseColor}
        shadowColor="#FFC0CB33"
        shadowBlur={8}
        shadowOffset={{ x: 2, y: 2 }}
      />
      {/* 装饰圆圈 */}
      <Circle
        x={tower.position.x + 20}
        y={tower.position.y + 20}
        radius={12}
        fill={accentColor}
      />
      {/* 星星装饰效果 */}
      <Star
        x={tower.position.x + 20}
        y={tower.position.y + 20}
        numPoints={5}
        innerRadius={5}
        outerRadius={8}
        fill="#FFF"
        opacity={0.8}
      />
    </Group>
  );
};

export default Tower;