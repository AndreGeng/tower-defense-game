import React from "react";
import { Rect, Image } from "react-konva";
import useImage from "use-image";
import type { Monster as MonsterType } from "../types/game";
import { useMonsterImg } from "../hooks/useMonsterImg";
import { findTargetEffect } from "../game/utils";
import FreezingImg from "../assets/freezing.png";

interface Props {
  monster: MonsterType;
}

const Monster: React.FC<Props> = ({ monster }) => {
  const monsterAssetMap = useMonsterImg();
  const hpBarWidth = monster.width / 2;
  const hpBarOffsetY = 5;
  const monsterOffsetY = 10;
  const [freezingImg] = useImage(FreezingImg);
  const hasSlowEffect = findTargetEffect(monster.specialEffects, "SLOW");
  return (
    <React.Fragment>
      {/* 怪物主体 - 使用圆形代替方形,增加可爱度 */}

      <Image
        x={monster.position.x - monster.width / 2}
        y={monster.position.y - monster.height / 2 - monsterOffsetY}
        image={monsterAssetMap[monster.type]}
        width={monster.width}
        height={monster.height}
      />
      {hasSlowEffect ? (
        <Image
          x={monster.position.x - monster.width / 2}
          y={monster.position.y - monster.height / 2 - monsterOffsetY}
          image={freezingImg}
          width={monster.width}
          height={monster.height}
          opacity={0.7}
        />
      ) : null}
      {/* 血条背景 */}
      <Rect
        x={monster.position.x - hpBarWidth / 2}
        y={
          monster.position.y -
          monster.height / 2 -
          monsterOffsetY -
          hpBarOffsetY
        }
        width={hpBarWidth}
        height={4}
        fill="#FFE4E1"
        cornerRadius={2}
      />
      {/* 血条 */}
      <Rect
        x={monster.position.x - hpBarWidth / 2}
        y={
          monster.position.y -
          monster.height / 2 -
          monsterOffsetY -
          hpBarOffsetY
        }
        width={hpBarWidth * (monster.hp / monster.maxHp)}
        height={4}
        fill="#FF69B4"
        cornerRadius={2}
      />
    </React.Fragment>
  );
};

export default Monster;
