interface GameOverModalProps {
  score: number;
  snakeLength: number;
  onRestart: () => void;
  saving: boolean;
  saved: boolean;
}

/**
 * 游戏结束弹窗
 * NOTE: 显示最终成绩并提供重新开始按钮
 */
export default function GameOverModal({
  score,
  snakeLength,
  onRestart,
  saving,
  saved,
}: GameOverModalProps) {
  return (
    <div className="modal-overlay" onClick={onRestart}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">▲</div>
        <h2 className="modal-title">CRITICAL FAILURE</h2>

        <div className="modal-stats">
          <div className="modal-stat">
            <span className="modal-stat-value">{score}</span>
            <span className="modal-stat-label">FINAL SCORE</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-value">{snakeLength}</span>
            <span className="modal-stat-label">MAX LENGTH</span>
          </div>
        </div>

        <div className="modal-save-status" style={{ marginBottom: '1.5rem', fontSize: '0.75rem' }}>
          {saving && <span className="save-indicator" style={{ color: 'var(--accent-secondary)' }}>UPLOADING RECORD...</span>}
          {saved && <span className="save-indicator save-indicator--done" style={{ color: 'var(--accent-primary)' }}>DATA SYNCHRONIZED</span>}
        </div>

        <button className="btn btn--primary" style={{ width: '100%', border: '1px solid var(--accent-danger)', background: 'transparent', color: 'var(--accent-danger)' }} onClick={onRestart}>
          RE-INITIALIZE
        </button>
      </div>
    </div>
  );
}

