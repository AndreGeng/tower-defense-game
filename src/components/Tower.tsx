import React from 'react';
import type { Tower as TowerType } from '../types/game';
import { TowerVariant } from '../types/game';
interface Props {
  tower: TowerType;
}

const Tower: React.FC<Props> = ({ tower }) => {
  const towerClass = tower.type === TowerVariant.NORMAL 
    ? 'bg-blue-500' 
    : 'bg-purple-500';

  return (
    <div
      className={`absolute w-[40px] h-[40px] rounded-full ${towerClass}`}
      style={{
        left: `${tower.position.x}px`,
        top: `${tower.position.y}px`
      }}
    />
  );
};

export default Tower;