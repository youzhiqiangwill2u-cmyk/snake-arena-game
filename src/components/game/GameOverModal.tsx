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
        <div className="modal-icon">💀</div>
        <h2 className="modal-title">游戏结束</h2>

        <div className="modal-stats">
          <div className="modal-stat">
            <span className="modal-stat-value">{score}</span>
            <span className="modal-stat-label">最终得分</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-value">{snakeLength}</span>
            <span className="modal-stat-label">蛇身长度</span>
          </div>
        </div>

        <div className="modal-save-status">
          {saving && <span className="save-indicator">⏳ 正在保存...</span>}
          {saved && <span className="save-indicator save-indicator--done">✅ 成绩已保存</span>}
        </div>

        <button className="btn btn--primary btn--lg" onClick={onRestart}>
          🔄 重新开始
        </button>
      </div>
    </div>
  );
}
