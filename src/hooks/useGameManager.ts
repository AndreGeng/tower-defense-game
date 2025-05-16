import { useState, useEffect } from "react";
import { useLatest } from "ahooks";
import type { GameState, Monster } from "../types/game";
import { WAVE_CONFIGS } from "../game/configs";
import { SPAWN_POINT, END_POINT, GAME_LOOP_FPS } from "../game/constants";
import { calculateNewPosition, findTargetMonster } from "../game/utils";

// 游戏管理器
export const useGameManager = (initialState: GameState) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [currentWave, setCurrentWave] = useState(0);
  const [monstersToSpawn, setMonstersToSpawn] = useState<
    Array<Omit<Monster, "id" | "position">>
  >([]);
  const [lastSpawnTime, setLastSpawnTime] = useState(0);
  const monstersToSpawnRef = useLatest(monstersToSpawn);
  const lastSpawnTimeRef = useLatest(lastSpawnTime);

  // 准备波次的怪物
  const prepareWaveMonsters = (waveIndex: number) => {
    if (waveIndex >= WAVE_CONFIGS.length) return [];

    const wave = WAVE_CONFIGS[waveIndex];
    const monsters: Array<Omit<Monster, "id" | "position">> = [];

    wave.monsters.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        monsters.push({
          hp: config.hp,
          maxHp: config.hp,
          speed: config.speed,
          damage: config.damage,
          width: config.width,
          height: config.height,
          slowEffect: 1,
        });
      }
    });

    return monsters;
  };

  // 更新怪物状态
  const updateMonsters = (prevState: GameState) => {
    let healthLoss = 0;
    const updatedMonsters = prevState.monsters
      .map((monster) => {
        const newPosition = calculateNewPosition(monster);

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
      monsters: updatedMonsters,
      healthLoss,
    };
  };

  // 处理塔的攻击
  const handleTowerAttacks = (prevState: GameState) => {
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

    // 移除死亡的怪物
    return updatedMonsters.filter((monster) => monster.hp > 0);
  };

  // 检查游戏状态
  const checkGameStatus = (prevState: GameState): GameState["gameStatus"] => {
    if (prevState.playerHealth <= 0) {
      return "lost";
    }
    // 这里可以添加胜利条件的检查
    return prevState.gameStatus;
  };

  useEffect(() => {
    // 开始新的波次
    const startNewWave = () => {
      const newWaveMonsters = prepareWaveMonsters(currentWave);
      setMonstersToSpawn(newWaveMonsters);
      if (currentWave === 0) {
        return;
      }
      setCurrentWave((prev) => prev + 1);
    };
    // 检查波次状态
    const checkWaveStatus = (prevState: GameState) => {
      if (
        monstersToSpawnRef.current.length === 0 &&
        prevState.monsters.length === 0
      ) {
        if (currentWave < WAVE_CONFIGS.length) {
          startNewWave();
        } else {
          return "won";
        }
      }
      return prevState.gameStatus;
    };
    // 生成怪物
    const spawnMonster = (prevState: GameState) => {
      if (monstersToSpawnRef.current.length === 0) return prevState.monsters;

      const currentTime = Date.now();
      const waveConfig = WAVE_CONFIGS[currentWave];

      if (currentTime - lastSpawnTimeRef.current < waveConfig.interval) {
        return prevState.monsters;
      }

      const monsterTemplate = monstersToSpawnRef.current[0];
      const newMonster: Monster = {
        ...monsterTemplate,
        id: Date.now(),
        position: { ...SPAWN_POINT },
      };

      setLastSpawnTime(currentTime);
      setMonstersToSpawn((prev) => prev.slice(1));

      return [...prevState.monsters, newMonster];
    };
    // 游戏主循环
    const main = () => {
      setGameState((prevState) => {
        // 生成新的怪物
        const monstersWithNewSpawn = spawnMonster(prevState);
        // 更新怪物位置和状态
        const { monsters: updatedMonsters, healthLoss } = updateMonsters({
          ...prevState,
          monsters: monstersWithNewSpawn,
        });
        // 处理塔的攻击
        const monstersAfterAttack = handleTowerAttacks({
          ...prevState,
          monsters: updatedMonsters,
        });
        // 检查游戏状态
        const newGameStatus = checkGameStatus({
          ...prevState,
          playerHealth: prevState.playerHealth - healthLoss,
          monsters: monstersAfterAttack,
        });
        // 检查波次状态
        const waveStatus = checkWaveStatus({
          ...prevState,
          monsters: monstersAfterAttack,
        });

        return {
          ...prevState,
          playerHealth: prevState.playerHealth - healthLoss,
          monsters: monstersAfterAttack,
          gameStatus: waveStatus === "won" ? "won" : newGameStatus,
        };
      });
    };
    if (currentWave === 0) {
      startNewWave();
    }
    const gameLoop = setInterval(() => {
      if (gameState.gameStatus !== "playing") {
        clearInterval(gameLoop);
        return;
      }
      main();
    }, 1000 / GAME_LOOP_FPS);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStatus, currentWave, lastSpawnTimeRef, monstersToSpawnRef]);

  return {
    gameState,
    setGameState,
  };
};

