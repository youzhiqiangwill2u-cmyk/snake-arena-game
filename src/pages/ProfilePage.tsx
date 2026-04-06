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
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }

  return (
    <div className="profile-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="page-header">
        <h1 className="page-title">OPERATOR PROFILE</h1>
        <p className="page-subtitle">SYSTEM IDENTIFICATION & METRICS</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="profile-card" style={{ width: '100%', maxWidth: 'none' }}>
            <div className="profile-avatar-lg">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2 className="profile-name" style={{ marginBottom: '0.5rem' }}>{profile.username}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.6, fontSize: '0.75rem' }}>
                <span>REGISTRATION: {formatDate(profile.createdAt)}</span>
                <span>LAST UPLINK: {formatDate(profile.lastLoginAt)}</span>
              </div>
            </div>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="stat-card" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(0, 255, 157, 0.05)' }}>
              <span className="stat-value" style={{ color: 'var(--accent-primary)' }}>{bestScore}</span>
              <span className="stat-label">PEAK SCORE</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totalGames}</span>
              <span className="stat-label">OPERATIONS</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{avgScore}</span>
              <span className="stat-label">AVG PERFORMANCE</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{formatDuration(totalPlayTime)}</span>
              <span className="stat-label">ACTIVE UPTIME</span>
            </div>
          </div>
        </div>

        <div className="records-section" style={{ background: 'var(--bg-dark-800)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h3 className="section-title" style={{ fontSize: '0.9rem', color: 'var(--text-low-em)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OPERATION LOGS</h3>
          {loading ? (
            <div className="page-center">
              <div className="loading-spinner" />
            </div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">NO LOGS AVAILABLE</p>
            </div>
          ) : (
            <div className="records-list" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
              {records.map((record, index) => (
                <div
                  key={record.id}
                  className="record-item"
                  style={{ animationDelay: `${index * 0.04}s`, padding: '12px', marginBottom: '8px', borderLeft: '2px solid var(--glass-border)' }}
                >
                  <div className="record-score">
                    <span className="record-score-value" style={{ fontSize: '1rem' }}>{record.score}</span>
                    <span className="record-score-label">PTS</span>
                  </div>
                  <div className="record-details" style={{ fontSize: '0.75rem' }}>
                    <span>LEN: {record.snakeLength}</span>
                    <span>DUR: {formatDuration(record.durationSeconds)}</span>
                  </div>
                  <div className="record-date" style={{ fontSize: '0.7rem' }}>
                    {formatDate(record.playedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

