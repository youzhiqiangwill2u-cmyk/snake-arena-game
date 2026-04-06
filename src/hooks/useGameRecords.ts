import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GameRecord, LeaderboardEntry } from '../types';

/**
 * 游戏记录 CRUD 操作 Hook
 * NOTE: 所有数据操作通过 Supabase RLS 策略保障安全性
 */
export function useGameRecords() {
  /**
   * 保存游戏记录到数据库
   * @param record 省略 id 和 playedAt 的游戏记录
   */
  const saveRecord = useCallback(async (record: {
    userId: string;
    score: number;
    durationSeconds: number;
    snakeLength: number;
  }) => {
    const { error } = await supabase.from('game_records').insert({
      user_id: record.userId,
      score: record.score,
      duration_seconds: record.durationSeconds,
      snake_length: record.snakeLength,
    });
    return { error: error?.message ?? null };
  }, []);

  /**
   * 获取当前用户的历史游戏记录
   */
  const fetchMyRecords = useCallback(async (userId: string): Promise<GameRecord[]> => {
    const { data, error } = await supabase
      .from('game_records')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      userId: r.user_id,
      score: r.score,
      durationSeconds: r.duration_seconds,
      snakeLength: r.snake_length,
      playedAt: r.played_at,
    }));
  }, []);

  /**
   * 获取排行榜数据
   */
  const fetchLeaderboard = useCallback(async (): Promise<LeaderboardEntry[]> => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(100);

    if (error || !data) return [];

    return data.map((e) => ({
      userId: e.user_id,
      username: e.username,
      avatarUrl: e.avatar_url,
      bestScore: e.best_score,
      totalGames: e.total_games,
      totalPlayTime: e.total_play_time,
      lastPlayedAt: e.last_played_at,
    }));
  }, []);

  return { saveRecord, fetchMyRecords, fetchLeaderboard };
}
