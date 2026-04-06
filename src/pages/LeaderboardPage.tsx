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
        <h1 className="page-title">GLOBAL RANKING</h1>
        <p className="page-subtitle">TOP PERFORMANCE METRICS</p>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">×</div>
          <p className="empty-text">NO DATA FOUND</p>
          <p className="empty-hint">ESTABLISH THE FIRST HIGH SCORE IN THE ARENA.</p>
        </div>
      ) : (
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>OPERATOR</th>
                <th>BEST SCORE</th>
                <th>OPS COUNT</th>
                <th>TOTAL UPTIME</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.userId}
                  className="leaderboard-row"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="rank-cell">
                    <span className={`rank-badge ${index < 3 ? 'rank-badge--top' : ''}`}>
                      {index + 1 === 1 ? '01' : index + 1 === 2 ? '02' : index + 1 === 3 ? '03' : index + 1}
                    </span>
                  </td>
                  <td className="player-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="player-avatar">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="player-name" style={{ fontWeight: 600 }}>{entry.username}</span>
                    </div>
                  </td>
                  <td className="score-cell">{entry.bestScore}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{entry.totalGames}</td>
                  <td style={{ color: 'var(--text-low-em)', fontSize: '0.85rem' }}>{formatPlayTime(entry.totalPlayTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

