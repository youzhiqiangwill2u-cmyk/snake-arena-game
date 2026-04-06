import { useState, useEffect } from 'react';
import { useGameRecords } from '../hooks/useGameRecords';
import type { LeaderboardEntry } from '../types';

/**
 * 排行榜页面
 * NOTE: 展示全服最高分排名，带渐入动画效果
 */
export default function LeaderboardPage() {
  const { fetchLeaderboard } = useGameRecords();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [fetchLeaderboard]);

  /**
   * 格式化游戏时长为可读文本
   */
  function formatPlayTime(seconds: number): string {
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}时${mins}分`;
  }

  /**
   * 排名奖牌图标
   */
  function getRankBadge(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }

  if (loading) {
    return (
      <div className="page-center">
        <div className="loading-spinner" />
        <p className="loading-text">加载排行榜...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1 className="page-title">🏆 排行榜</h1>
        <p className="page-subtitle">全服最高分排名</p>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎮</div>
          <p className="empty-text">暂无游戏记录</p>
          <p className="empty-hint">成为第一个上榜的玩家吧！</p>
        </div>
      ) : (
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>排名</th>
                <th>玩家</th>
                <th>最高分</th>
                <th>游戏次数</th>
                <th>总时长</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.userId}
                  className={`leaderboard-row ${index < 3 ? 'leaderboard-row--top' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="rank-cell">
                    <span className={`rank-badge ${index < 3 ? 'rank-badge--top' : ''}`}>
                      {getRankBadge(index + 1)}
                    </span>
                  </td>
                  <td className="player-cell">
                    <div className="player-avatar">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="player-name">{entry.username}</span>
                  </td>
                  <td className="score-cell">{entry.bestScore}</td>
                  <td>{entry.totalGames}</td>
                  <td>{formatPlayTime(entry.totalPlayTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
