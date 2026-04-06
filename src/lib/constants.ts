/**
 * 游戏核心常量配置
 * NOTE: 所有游戏参数集中管理，便于调整平衡性
 */

/** 游戏画布的网格列数 */
export const GRID_COLS = 20;

/** 游戏画布的网格行数 */
export const GRID_ROWS = 20;

/** 每个格子的像素大小 */
export const CELL_SIZE = 24;

/** 画布总宽度 */
export const CANVAS_WIDTH = GRID_COLS * CELL_SIZE;

/** 画布总高度 */
export const CANVAS_HEIGHT = GRID_ROWS * CELL_SIZE;

/** 蛇的初始长度 */
export const INITIAL_SNAKE_LENGTH = 3;

/** 初始移动间隔（毫秒），数值越小移动越快 */
export const INITIAL_SPEED = 180;

/** 最小移动间隔（毫秒），速度上限 */
export const MIN_SPEED = 60;

/** 每得分加速量（毫秒） */
export const SPEED_INCREMENT = 3;

/** 每个食物的基础得分 */
export const SCORE_PER_FOOD = 10;

/** 方向映射：键盘键 → 移动向量 */
export const DIRECTION_MAP: Record<string, { x: number; y: number }> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

/** 颜色主题 */
export const THEME = {
  background: '#0a0a0f',
  gridLine: 'rgba(255, 255, 255, 0.03)',
  snakeHead: '#00ff88',
  snakeBody: '#00cc6a',
  snakeTail: '#009950',
  food: '#ff6b6b',
  foodGlow: 'rgba(255, 107, 107, 0.4)',
  neonGreen: '#00ff88',
  neonPurple: '#a855f7',
  neonBlue: '#3b82f6',
  textPrimary: '#e0e0e0',
  textSecondary: '#888888',
} as const;

/** 
 * 测试模式开关 
 * NOTE: 开启后将跳过 Supabase Auth 验证，使用虚拟账号登录
 */
export const IS_TEST_MODE = true;
