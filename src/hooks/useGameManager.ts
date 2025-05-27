import { useState, useEffect, useCallback } from "react";
import type { GameState, Monster } from "../types/game";
import { generatePath } from "../game/path";
import type { PathPoint } from "../game/path";
import { WAVE_CONFIGS } from "../game/configs";
import {
  calculateNewPosition,
  findTargetMonster,
  getId,
  prepareWaveMonsters,
} from "../game/utils";

// 游戏管理器
export const useGameManager = (initialState: GameState) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  // 添加路径状态
  const [path] = useState<PathPoint[]>(generatePath());
  const SPAWN_POINT = path[0];
  const END_POINT = path[path.length - 1];

  // 生成怪物
  const spawnMonster = useCallback(() => {
    setGameState((prevState) => {
      const { monstersToSpawn, lastSpawnTime } = prevState;
      if (monstersToSpawn.length === 0) return prevState;

      const currentTime = Date.now();

      // 使用时间差绝对值判断
      if (currentTime - lastSpawnTime < 2000) {
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
        monsters: [...prevState.monsters, newMonster],
        monstersToSpawn: monstersToSpawn.slice(1),
        lastSpawnTime: currentTime,
      };
    });
  }, [SPAWN_POINT]);
  // 更新怪物状态
  const updateMonsters = useCallback(() => {
    setGameState((prevState) => {
      let healthLoss = 0;
      const updatedMonsters = prevState.monsters
        .map((monster) => {
          const newPosition = calculateNewPosition(monster, path);

          // 检查是否到达终点
          if (
            Math.abs(newPosition.x - END_POINT.x) < monster.width &&
            Math.abs(newPosition.y - END_POINT.y) < monster.height
          ) {
            healthLoss += monster.damage;
            return null;
          }

          return {
            ...monster,
            position: newPosition,
          };
        })
        .filter(Boolean) as Monster[];
      return {
        ...prevState,
        monsters: updatedMonsters,
        playerHealth: prevState.playerHealth - healthLoss,
      };
    });
  }, [END_POINT.x, END_POINT.y, path]);
  // 处理塔的攻击
  const handleTowerAttacks = useCallback(() => {
    setGameState((prevState) => {
      const updatedMonsters = [...prevState.monsters];

      prevState.towers.forEach((tower) => {
        // 找到塔攻击范围内的怪物
        const targetMonster = findTargetMonster(tower, updatedMonsters);
        if (targetMonster) {
          // 对怪物造成伤害
          targetMonster.hp -= tower.damage;
          // 应用特殊效果
          if (tower.specialEffect?.type === "slow") {
            targetMonster.slowEffect = tower.specialEffect.value;
          }
        }
      });

      return {
        ...prevState,
        // 移除死亡的怪物
        monsters: updatedMonsters.filter((monster) => monster.hp > 0),
      };
    });
  }, []);

  // 检查游戏状态
  const checkGameStatus = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.playerHealth <= 0) {
        return {
          ...prevState,
          gameStatus: "lost",
        };
      }
      if (
        prevState.monstersToSpawn.length === 0 &&
        prevState.monsters.length === 0
      ) {
        if (prevState.wave < WAVE_CONFIGS.length - 1) {
          startNewWave();
        } else {
          return {
            ...prevState,
            gameStatus: "won",
          };
        }
      }
      // 这里可以添加胜利条件的检查
      return prevState;
    });
  }, []);
  // 开始新的波次
  const startNewWave = () => {
    setGameState((prev) => ({
      ...prev,
      wave: prev.wave + 1,
      monstersToSpawn: prepareWaveMonsters(prev.wave + 1),
    }));
  };

  // 游戏主循环
  const main = useCallback(() => {
    // 生成新的怪物
    spawnMonster();
    // 更新怪物位置和状态
    updateMonsters();
    // 处理塔的攻击
    handleTowerAttacks();
    // 检查游戏状态
    // checkGameStatus();
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
