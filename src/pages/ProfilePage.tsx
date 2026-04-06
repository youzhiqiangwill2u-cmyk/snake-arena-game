import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGameRecords } from '../hooks/useGameRecords';
import type { GameRecord } from '../types';

/**
 * 个人中心页面
 * NOTE: 展示用户数据统计和历史游戏记录
 */
export default function ProfilePage() {
  const { profile } = useAuth();
  const { fetchMyRecords } = useGameRecords();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchMyRecords(profile.id).then((data) => {
        setRecords(data);
        setLoading(false);
      });
    }
  }, [profile, fetchMyRecords]);

  if (!profile) return null;

  const bestScore = records.length > 0
    ? Math.max(...records.map((r) => r.score))
    : 0;

  const totalGames = records.length;

  const avgScore = totalGames > 0
    ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / totalGames)
    : 0;

  const totalPlayTime = records.reduce((sum, r) => sum + r.durationSeconds, 0);

  /**
   * 格式化日期
   */
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * 格式化游戏时长
   */
  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}秒`;
    return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">👤 个人中心</h1>
      </div>

      {/* 用户信息卡片 */}
      <div className="profile-card">
        <div className="profile-avatar-lg">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{profile.username}</h2>
          <p className="profile-meta">
            注册于 {formatDate(profile.createdAt)}
          </p>
          <p className="profile-meta">
            最后登录 {formatDate(profile.lastLoginAt)}
          </p>
        </div>
      </div>

      {/* 数据统计卡片 */}
      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <span className="stat-icon">🏆</span>
          <span className="stat-value">{bestScore}</span>
          <span className="stat-label">最高分</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎮</span>
          <span className="stat-value">{totalGames}</span>
          <span className="stat-label">游戏次数</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-value">{avgScore}</span>
          <span className="stat-label">平均分</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{formatDuration(totalPlayTime)}</span>
          <span className="stat-label">总时长</span>
        </div>
      </div>

      {/* 历史记录列表 */}
      <div className="records-section">
        <h3 className="section-title">🕹️ 历史记录</h3>
        {loading ? (
          <div className="page-center">
            <div className="loading-spinner" />
          </div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">还没有游戏记录</p>
          </div>
        ) : (
          <div className="records-list">
            {records.map((record, index) => (
              <div
                key={record.id}
                className="record-item"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="record-score">
                  <span className="record-score-value">{record.score}</span>
                  <span className="record-score-label">分</span>
                </div>
                <div className="record-details">
                  <span>🐍 长度 {record.snakeLength}</span>
                  <span>⏱️ {formatDuration(record.durationSeconds)}</span>
                </div>
                <div className="record-date">
                  {formatDate(record.playedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
