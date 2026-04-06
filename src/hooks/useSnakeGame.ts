import { useCallback, useEffect, useRef, useState } from 'react';
import type { Point, Direction, GameStatus, GameState } from '../types';
import {
  GRID_COLS,
  GRID_ROWS,
  INITIAL_SNAKE_LENGTH,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_INCREMENT,
  SCORE_PER_FOOD,
  DIRECTION_MAP,
} from '../lib/constants';

/**
 * 生成初始蛇身
 * NOTE: 蛇从画布中央向左排列
 */
function createInitialSnake(): Point[] {
  const startX = Math.floor(GRID_COLS / 2);
  const startY = Math.floor(GRID_ROWS / 2);
  return Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
    x: startX - i,
    y: startY,
  }));
}

/**
 * 在空白位置随机生成食物
 * @param snake 当前蛇身占据的位置
 */
function generateFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_COLS),
      y: Math.floor(Math.random() * GRID_ROWS),
    };
  } while (occupied.has(`${food.x},${food.y}`));
  return food;
}

/**
 * 方向键到 Direction 类型的映射
 */
function vectorToDirection(vec: { x: number; y: number }): Direction {
  if (vec.y === -1) return 'UP';
  if (vec.y === 1) return 'DOWN';
  if (vec.x === -1) return 'LEFT';
  return 'RIGHT';
}

/**
 * 判断两个方向是否相反（禁止 180 度掉头）
 */
function isOpposite(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

/**
 * Direction 类型转移动向量
 */
function directionToVector(dir: Direction): Point {
  switch (dir) {
    case 'UP': return { x: 0, y: -1 };
    case 'DOWN': return { x: 0, y: 1 };
    case 'LEFT': return { x: -1, y: 0 };
    case 'RIGHT': return { x: 1, y: 0 };
  }
}

/**
 * 贪吃蛇游戏核心逻辑 Hook
 * NOTE: 所有游戏状态和控制逻辑封装在此 Hook 中，与渲染层解耦
 */
export function useSnakeGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const snake = createInitialSnake();
    return {
      snake,
      food: generateFood(snake),
      direction: 'RIGHT',
      score: 0,
      status: 'IDLE',
      speed: INITIAL_SPEED,
      startTime: null,
    };
  });

  // 使用 ref 缓存最新状态，避免闭包陷阱
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // 下一个方向队列，防止快速按键导致穿身
  const nextDirectionRef = useRef<Direction | null>(null);

  // 游戏循环定时器
  const timerRef = useRef<number | null>(null);

  /**
   * 游戏核心循环：移动蛇身、碰撞检测、吃食物
   */
  const gameLoop = useCallback(() => {
    const state = stateRef.current;
    if (state.status !== 'PLAYING') return;

    const dir = nextDirectionRef.current ?? state.direction;
    nextDirectionRef.current = null;

    const vec = directionToVector(dir);
    const head = state.snake[0];
    const newHead: Point = {
      x: head.x + vec.x,
      y: head.y + vec.y,
    };

    // 碰撞检测：撞墙
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_COLS ||
      newHead.y < 0 ||
      newHead.y >= GRID_ROWS
    ) {
      setGameState((prev) => ({ ...prev, status: 'GAME_OVER', direction: dir }));
      return;
    }

    // 碰撞检测：撞自身（排除尾巴，因为尾巴会移走）
    const willEat = newHead.x === state.food.x && newHead.y === state.food.y;
    const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
    if (bodyToCheck.some((p) => p.x === newHead.x && p.y === newHead.y)) {
      setGameState((prev) => ({ ...prev, status: 'GAME_OVER', direction: dir }));
      return;
    }

    // 构建新蛇身
    const newSnake = [newHead, ...state.snake];
    let newScore = state.score;
    let newFood = state.food;
    let newSpeed = state.speed;

    if (willEat) {
      // 吃到食物：不移除尾巴 → 蛇身增长
      newScore += SCORE_PER_FOOD;
      newFood = generateFood(newSnake);
      newSpeed = Math.max(MIN_SPEED, state.speed - SPEED_INCREMENT);
    } else {
      // 没吃到：移除尾巴保持长度
      newSnake.pop();
    }

    setGameState({
      snake: newSnake,
      food: newFood,
      direction: dir,
      score: newScore,
      status: 'PLAYING',
      speed: newSpeed,
      startTime: state.startTime,
    });
  }, []);

  /**
   * 游戏循环调度器
   * NOTE: 使用 setTimeout 而非 setInterval，以支持动态变速
   */
  useEffect(() => {
    if (gameState.status === 'PLAYING') {
      timerRef.current = window.setTimeout(gameLoop, gameState.speed);
    }
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, gameLoop]);

  /**
   * 键盘输入处理
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current;

      // 空格键：暂停/继续
      if (e.key === ' ') {
        e.preventDefault();
        if (state.status === 'PLAYING') {
          setGameState((prev) => ({ ...prev, status: 'PAUSED' }));
        } else if (state.status === 'PAUSED') {
          setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
        }
        return;
      }

      // 方向键
      const vec = DIRECTION_MAP[e.key];
      if (!vec) return;

      e.preventDefault();
      const newDir = vectorToDirection(vec);
      const currentDir = nextDirectionRef.current ?? state.direction;

      // 禁止 180 度掉头
      if (isOpposite(newDir, currentDir)) return;

      if (state.status === 'IDLE') {
        // 首次按方向键开始游戏
        setGameState((prev) => ({
          ...prev,
          direction: newDir,
          status: 'PLAYING',
          startTime: Date.now(),
        }));
      } else if (state.status === 'PLAYING') {
        nextDirectionRef.current = newDir;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * 重新开始游戏
   */
  const restart = useCallback(() => {
    nextDirectionRef.current = null;
    const snake = createInitialSnake();
    setGameState({
      snake,
      food: generateFood(snake),
      direction: 'RIGHT',
      score: 0,
      status: 'IDLE',
      speed: INITIAL_SPEED,
      startTime: null,
    });
  }, []);

  /**
   * 手动设置方向（触摸控制用）
   */
  const setDirection = useCallback((dir: Direction) => {
    const state = stateRef.current;
    const currentDir = nextDirectionRef.current ?? state.direction;
    if (isOpposite(dir, currentDir)) return;

    if (state.status === 'IDLE') {
      setGameState((prev) => ({
        ...prev,
        direction: dir,
        status: 'PLAYING',
        startTime: Date.now(),
      }));
    } else if (state.status === 'PLAYING') {
      nextDirectionRef.current = dir;
    }
  }, []);

  /**
   * 计算游戏时长（秒）
   */
  const getDurationSeconds = useCallback((): number => {
    const state = stateRef.current;
    if (!state.startTime) return 0;
    return Math.floor((Date.now() - state.startTime) / 1000);
  }, []);

  return {
    gameState,
    restart,
    setDirection,
    getDurationSeconds,
  };
}
