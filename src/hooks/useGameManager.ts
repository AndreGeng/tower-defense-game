import { useState, useEffect, useCallback } from "react";
import { produce } from "immer";
import type { GameState, Monster, SpecialEffect } from "../types/game";
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
    setGameState(
      produce((draft) => {
        const { monstersToSpawn, lastSpawnTime, wave } = draft;
        if (monstersToSpawn.length === 0) return;

        const currentTime = Date.now();
        if (currentTime - lastSpawnTime < WAVE_CONFIGS[wave].interval) return;

        const monsterTemplate = monstersToSpawn[0];
        const newMonster: Monster = {
          ...monsterTemplate,
          id: getId(),
          position: { ...SPAWN_POINT },
        };

        draft.monsterMap[newMonster.id] = newMonster;
        draft.monstersToSpawn = monstersToSpawn.slice(1);
        draft.lastSpawnTime = currentTime;
      }),
    );
  }, [SPAWN_POINT]);

  // 更新怪物状态
  const updateMonsters = useCallback(() => {
    setGameState(
      produce((draft) => {
        let healthLoss = 0;
        Object.keys(draft.monsterMap).forEach((monsterId) => {
          const monster = draft.monsterMap[monsterId];
          const [pathIndex, newPosition] = calculateNewPosition(monster, path);

          if (
            Math.abs(newPosition.x - END_POINT.x) < monster.width &&
            Math.abs(newPosition.y - END_POINT.y) < monster.height
          ) {
            healthLoss += monster.damage;
            delete draft.monsterMap[monsterId];
            return;
          }

          draft.monsterMap[monsterId] = {
            ...monster,
            position: newPosition,
            pathIndex,
            specialEffects: getValidSpecialEffect(monster.specialEffects),
          };
        });

        draft.playerHealth -= healthLoss;
      }),
    );
  }, [END_POINT.x, END_POINT.y, path]);

  // 处理塔的攻击
  const handleTowerAttacks = useCallback(() => {
    setGameState(
      produce((draft) => {
        const attackedTowerList: number[] = [];
        const monsterDamageMap: Record<
          string,
          {
            damage: number;
            specialEffects: SpecialEffect[];
          }
        > = {};

        // 处理塔的攻击
        Object.keys(draft.towerMap).forEach((towerId) => {
          const tower = draft.towerMap[towerId];
          if (Date.now() - tower.lastAttackTime < tower.attackInterval) return;

          attackedTowerList.push(tower.id);
          const targetMonster = findTargetMonster(
            tower,
            Object.values(draft.monsterMap),
          );

          if (targetMonster) {
            const id = getId();
            draft.bulletMap[id] = {
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
        });

        // 更新子弹位置
        Object.keys(draft.bulletMap).forEach((bulletId) => {
          const bullet = draft.bulletMap[bulletId];
          const tower = draft.towerMap[bullet.towerId];
          const targetMonster = draft.monsterMap[bullet.targetMonsterId];

          if (!targetMonster) {
            delete draft.bulletMap[bulletId];
            return;
          }

          const dx = targetMonster.position.x - bullet.position.x;
          const dy = targetMonster.position.y - bullet.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 10) {
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
            delete draft.bulletMap[bulletId];
            return;
          }

          draft.bulletMap[bulletId] = {
            ...bullet,
            position: {
              x: bullet.position.x + (dx / distance) * bullet.speed,
              y: bullet.position.y + (dy / distance) * bullet.speed,
            },
          };
        });

        // 处理怪物伤害
        let goldDelta = 0;
        Object.keys(draft.monsterMap).forEach((monsterId) => {
          const monster = draft.monsterMap[monsterId];
          if (!monsterDamageMap[monsterId]) return;

          const newHp = monster.hp - monsterDamageMap[monsterId].damage;
          if (newHp > 0) {
            draft.monsterMap[monsterId] = {
              ...monster,
              hp: newHp,
              specialEffects: monsterDamageMap[monsterId].specialEffects,
            };
          } else {
            goldDelta += monster.gold;
            delete draft.monsterMap[monsterId];
          }
        });

        draft.gold += goldDelta;

        // 更新塔的攻击时间
        attackedTowerList.forEach((towerId) => {
          draft.towerMap[towerId] = {
            ...draft.towerMap[towerId],
            lastAttackTime: Date.now(),
          };
        });
      }),
    );
  }, []);

  // 检查游戏状态
  const checkGameStatus = useCallback(() => {
    setGameState(
      produce((draft) => {
        if (draft.playerHealth <= 0) {
          playDeath();
          draft.gameStatus = "lost";
          return;
        }

        if (
          draft.monstersToSpawn.length === 0 &&
          Object.keys(draft.monsterMap).length === 0
        ) {
          if (draft.wave < WAVE_CONFIGS.length - 1) {
            draft.wave += 1;
            draft.monstersToSpawn = prepareWaveMonsters(draft.wave);
          } else {
            playVictory();
            draft.gameStatus = "won";
          }
        }
      }),
    );
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
