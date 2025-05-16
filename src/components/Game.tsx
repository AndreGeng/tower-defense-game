import React, { useState, useEffect } from "react";
import { useLatest } from "ahooks";
import type { GameState, Monster, Tower, Position } from "../types/game";
import MonsterComponent from "./Monster";
import TowerComponent from "./Tower";

// 波次配置
interface WaveConfig {
  monsters: (Pick<Monster, "hp" | "speed" | "damage" | "width" | "height"> & {
    count: number;
  })[];
  interval: number; // 怪物生成间隔（毫秒）
}

const WAVE_CONFIGS: WaveConfig[] = [
  {
    monsters: [
      { count: 5, hp: 100, speed: 5, damage: 1, width: 30, height: 30 },
      { count: 3, hp: 150, speed: 2.5, damage: 2, width: 30, height: 30 },
    ],
    interval: 2000,
  },
  // 可以添加更多波次配置
];

// 怪物出生点和终点
const SPAWN_POINT: Position = { x: 0, y: 300 };
const END_POINT: Position = { x: 800, y: 300 };

const initialGameState: GameState = {
  playerHealth: 10,
  gold: 100,
  wave: 1,
  monsters: [],
  towers: [],
  gameStatus: "playing",
};

// 游戏管理器
const useGameManager = (initialState: GameState) => {
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
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStatus, currentWave, lastSpawnTimeRef, monstersToSpawnRef]);

  return {
    gameState,
    setGameState,
  };
};

const Game: React.FC = () => {
  const { gameState } = useGameManager(initialGameState);

  // 渲染游戏结果弹窗
  const renderGameOverModal = () => {
    if (gameState.gameStatus === "playing") return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {gameState.gameStatus === "won" ? "游戏胜利！" : "游戏失败！"}
          </h2>
          <p className="mb-4 text-gray-600">
            {gameState.gameStatus === "won"
              ? "恭喜你成功击退了所有敌人！"
              : "很遗憾，请再接再厉！"}
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            重新开始
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-[800px] h-[600px] border-2 border-gray-800 relative">
      <div className="w-full h-full bg-gray-200 relative">
        {gameState.monsters.map((monster) => (
          <MonsterComponent key={monster.id} monster={monster} />
        ))}
        {gameState.towers.map((tower) => (
          <TowerComponent key={tower.id} tower={tower} />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 p-4 bg-gray-800 text-white w-full">
        <div className="flex justify-between">
          <span>生命值: {gameState.playerHealth}</span>
          <span>金币: {gameState.gold}</span>
          <span>波数: {gameState.wave}</span>
        </div>
      </div>
      {renderGameOverModal()}
    </div>
  );
};

// 辅助函数
const calculateNewPosition = (monster: Monster): Position => {
  // 简单的直线路径
  const dx = END_POINT.x - monster.position.x;
  const dy = END_POINT.y - monster.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < monster.speed) {
    return END_POINT;
  }

  const vx = (dx / distance) * monster.speed;
  const vy = (dy / distance) * monster.speed;

  return {
    x: monster.position.x + vx,
    y: monster.position.y + vy,
  };
};

const findTargetMonster = (
  tower: Tower,
  monsters: Monster[],
): Monster | undefined => {
  return monsters.find((monster) => {
    const distance = Math.sqrt(
      Math.pow(tower.position.x - monster.position.x, 2) +
        Math.pow(tower.position.y - monster.position.y, 2),
    );
    return distance <= tower.range;
  });
};

export default Game;
