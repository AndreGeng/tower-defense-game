import { useState, useEffect, useCallback } from "react";
import type {
  GameState,
  Monster,
  Bullet,
  Tower,
  SpecialEffect,
} from "../types/game";
import { generatePath } from "../game/path";
import type { PathPoint } from "../game/path";
import { NORMAL_TOWER, SLOW_TOWER, WAVE_CONFIGS } from "../game/configs";
import {
  calculateNewPosition,
  findTargetMonster,
  getId,
  prepareWaveMonsters,
  getValidSpecialEffect,
} from "../game/utils";

// 游戏管理器
export const useGameManager = (
  initialState: GameState,
  {
    playVictory,
    playDeath,
  }: { playVictory: () => void; playDeath: () => void },
) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  // 添加路径状态
  const [path] = useState<PathPoint[]>(generatePath());
  const SPAWN_POINT = path[0];
  const END_POINT = path[path.length - 1];

  // 生成怪物
  const spawnMonster = useCallback(() => {
    setGameState((prevState) => {
      const { monstersToSpawn, lastSpawnTime, wave } = prevState;
      if (monstersToSpawn.length === 0) return prevState;

      const currentTime = Date.now();

      // 使用时间差绝对值判断
      if (currentTime - lastSpawnTime < WAVE_CONFIGS[wave].interval) {
        return prevState;
      }

      const monsterTemplate = monstersToSpawn[0];
      const newMonster: Monster = {
        ...monsterTemplate,
        id: getId(),
        position: { ...SPAWN_POINT },
      };

      return {
        ...prevState,
        monsterMap: {
          ...prevState.monsterMap,
          [newMonster.id]: newMonster,
        },
        monstersToSpawn: monstersToSpawn.slice(1),
        lastSpawnTime: currentTime,
      };
    });
  }, [SPAWN_POINT]);
  // 更新怪物状态
  const updateMonsters = useCallback(() => {
    setGameState((prevState) => {
      let healthLoss = 0;
      const updatedMonsterMap = Object.keys(prevState.monsterMap).reduce(
        (acc, monsterId) => {
          const monster = prevState.monsterMap[monsterId];
          const [pathIndex, newPosition] = calculateNewPosition(monster, path);

          // 检查是否到达终点
          if (
            Math.abs(newPosition.x - END_POINT.x) < monster.width &&
            Math.abs(newPosition.y - END_POINT.y) < monster.height
          ) {
            healthLoss += monster.damage;
            return acc;
          }

          return {
            ...acc,
            [monsterId]: {
              ...monster,
              position: newPosition,
              pathIndex,
              // 去除已失效的特效
              specialEffects: getValidSpecialEffect(monster.specialEffects),
            },
          };
        },
        {} as Record<string, Monster>,
      );

      return {
        ...prevState,
        monsterMap: updatedMonsterMap,
        playerHealth: prevState.playerHealth - healthLoss,
      };
    });
  }, [END_POINT.x, END_POINT.y, path]);
  // 处理塔的攻击
  const handleTowerAttacks = useCallback(() => {
    setGameState((prevState) => {
      const attackedTowerList: number[] = [];
      const monsterDamageMap: Record<
        string,
        {
          damage: number;
          specialEffects: SpecialEffect[];
        }
      > = {};

      // 处理塔的攻击
      const newBulletMap = Object.keys(prevState.towerMap).reduce(
        (acc, towerId) => {
          const tower = prevState.towerMap[towerId];
          if (Date.now() - tower.lastAttackTime < tower.attackInterval) {
            return acc;
          }
          attackedTowerList.push(tower.id);
          // 找到塔攻击范围内的怪物
          const targetMonster = findTargetMonster(
            tower,
            Object.keys(prevState.monsterMap).map(
              (id) => prevState.monsterMap[id],
            ),
          );
          if (targetMonster) {
            const id = getId();
            // 创建新的子弹
            acc[id] = {
              id,
              position: {
                x: tower.position.x,
                y: tower.position.y,
              },
              targetMonsterId: targetMonster.id,
              damage: tower.damage,
              speed:
                tower.type === "NORMAL" ? NORMAL_TOWER.speed : SLOW_TOWER.speed,
              towerId: Number(towerId),
            };
          }
          return acc;
        },
        {} as Record<string, Bullet>,
      );

      // 更新子弹位置
      const remainingBulletMap = Object.keys(prevState.bulletMap).reduce(
        (acc, bulletId) => {
          const bullet = prevState.bulletMap[bulletId];
          const tower = prevState.towerMap[bullet.towerId];
          const targetMonster = prevState.monsterMap[bullet.targetMonsterId];
          if (!targetMonster) {
            return acc;
          }
          // 计算子弹到目标的方向
          const dx = targetMonster.position.x - bullet.position.x;
          const dy = targetMonster.position.y - bullet.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 如果子弹击中目标
          if (distance < 10) {
            // 对怪物造成伤害
            monsterDamageMap[bullet.targetMonsterId] = {
              damage:
                (monsterDamageMap[bullet.targetMonsterId]?.damage || 0) +
                bullet.damage,
              specialEffects: [
                ...(monsterDamageMap[bullet.targetMonsterId]?.specialEffects ||
                  []),
                ...(tower.specialEffect
                  ? [
                      {
                        ...tower.specialEffect,
                        applyTime: Date.now(),
                      },
                    ]
                  : []),
              ],
            };
            return acc;
          }

          // 更新子弹位置
          const speed = bullet.speed;
          acc[bulletId] = {
            ...bullet,
            position: {
              x: bullet.position.x + (dx / distance) * speed,
              y: bullet.position.y + (dy / distance) * speed,
            },
          };
          return acc;
        },
        {} as Record<string, Bullet>,
      );

      let goldDelta = 0;
      const updatedMonsterMap = Object.keys(prevState.monsterMap).reduce(
        (acc, monsterId) => {
          const monster = prevState.monsterMap[monsterId];
          if (!monsterDamageMap[monsterId]) {
            acc[monsterId] = monster;
            return acc;
          }
          const newHp = monster.hp - monsterDamageMap[monsterId].damage;
          if (newHp > 0) {
            acc[monsterId] = {
              ...monster,
              hp: newHp,
              specialEffects: monsterDamageMap[monsterId].specialEffects,
            };
          } else {
            goldDelta += monster.gold;
          }
          return acc;
        },
        {} as Record<string, Monster>,
      );

      return {
        ...prevState,
        bulletMap: {
          ...remainingBulletMap,
          ...newBulletMap,
        },
        monsterMap: updatedMonsterMap,
        gold: prevState.gold + goldDelta,
        // 移除死亡的怪物
        towerMap: Object.keys(prevState.towerMap).reduce(
          (acc, towerId) => {
            const tower = prevState.towerMap[towerId];
            if (attackedTowerList.includes(Number(towerId))) {
              acc[towerId] = {
                ...tower,
                lastAttackTime: Date.now(),
              };
              return acc;
            }
            acc[towerId] = tower;
            return acc;
          },
          {} as Record<string, Tower>,
        ),
      };
    });
  }, []);

  // 检查游戏状态
  const checkGameStatus = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.playerHealth <= 0) {
        playDeath(); // 播放失败音效
        return {
          ...prevState,
          gameStatus: "lost",
        };
      }
      if (
        prevState.monstersToSpawn.length === 0 &&
        Object.keys(prevState.monsterMap).length === 0
      ) {
        if (prevState.wave < WAVE_CONFIGS.length - 1) {
          return startNewWave(prevState);
        } else {
          playVictory(); // 播放胜利音效
          return {
            ...prevState,
            gameStatus: "won",
          };
        }
      }
      return prevState;
    });
  }, [playVictory, playDeath]);
  // 开始新的波次
  const startNewWave = (prev: GameState) => {
    return {
      ...prev,
      wave: prev.wave + 1,
      monstersToSpawn: prepareWaveMonsters(prev.wave + 1),
    };
  };

  // 游戏主循环
  const main = useCallback(() => {
    // 生成新的怪物
    spawnMonster();
    // 处理塔的攻击
    handleTowerAttacks();
    // 更新怪物位置和状态
    updateMonsters();
    // 检查游戏状态
    checkGameStatus();
  }, [spawnMonster, updateMonsters, checkGameStatus, handleTowerAttacks]);

  useEffect(() => {
    let gameLoop: number;

    const nextGameLoop = () => {
      if (gameState.gameStatus !== "playing") {
        cancelAnimationFrame(gameLoop);
        return;
      }
      main();
      gameLoop = requestAnimationFrame(nextGameLoop);
    };
    gameLoop = requestAnimationFrame(nextGameLoop);

    return () => {
      cancelAnimationFrame(gameLoop);
    };
  }, [gameState.gameStatus, main]);

  return {
    gameState,
    path,
    setGameState,
  };
};
