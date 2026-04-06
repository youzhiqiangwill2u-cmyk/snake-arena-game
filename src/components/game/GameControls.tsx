import type { Direction } from '../../types';

interface GameControlsProps {
  onDirection: (dir: Direction) => void;
  onPause: () => void;
  isPaused: boolean;
  isPlaying: boolean;
}

/**
 * 游戏控制面板
 * NOTE: 移动端触摸按钮 + 桌面端快捷键提示
 */
export default function GameControls({
  onDirection,
  onPause,
  isPaused,
  isPlaying,
}: GameControlsProps) {
  return (
    <div className="game-controls">
      {/* 移动端方向按钮 */}
      <div className="touch-controls">
        <div className="touch-row">
          <button
            className="touch-btn"
            onClick={() => onDirection('UP')}
            aria-label="UP"
          >
            ▲
          </button>
        </div>
        <div className="touch-row">
          <button
            className="touch-btn"
            onClick={() => onDirection('LEFT')}
            aria-label="LEFT"
          >
            ◀
          </button>
          <button
            className="touch-btn touch-btn--center"
            onClick={onPause}
            aria-label={isPaused ? 'RESUME' : 'PAUSE'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <button
            className="touch-btn"
            onClick={() => onDirection('RIGHT')}
            aria-label="RIGHT"
          >
            ▶
          </button>
        </div>
        <div className="touch-row">
          <button
            className="touch-btn"
            onClick={() => onDirection('DOWN')}
            aria-label="DOWN"
          >
            ▼
          </button>
        </div>
      </div>

      {/* 桌面端快捷键提示 */}
      <div className="keyboard-hints">
        <div className="hint-item">
          <kbd>ARROW</kbd> / <kbd>WASD</kbd> TO NAVIGATE
        </div>
        {isPlaying && (
          <div className="hint-item">
            <kbd>SPACE</kbd> TO PAUSE
          </div>
        )}
      </div>
    </div>
  );
}

