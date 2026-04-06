/**
 * 全局类型定义
 */

/** 二维坐标点 */
export interface Point {
  x: number;
  y: number;
}

/** 移动方向 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/** 游戏状态枚举 */
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

/** 游戏状态快照，用于渲染和数据上传 */
export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  status: GameStatus;
  speed: number;
  startTime: number | null;
}

/** 用户资料 */
export interface Profile {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
}

/** 游戏记录 */
export interface GameRecord {
  id: string;
  userId: string;
  score: number;
  durationSeconds: number;
  snakeLength: number;
  playedAt: string;
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  bestScore: number;
  totalGames: number;
  totalPlayTime: number;
  lastPlayedAt: string;
}
