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
            aria-label="上移"
          >
            ▲
          </button>
        </div>
        <div className="touch-row">
          <button
            className="touch-btn"
            onClick={() => onDirection('LEFT')}
            aria-label="左移"
          >
            ◀
          </button>
          <button
            className="touch-btn touch-btn--center"
            onClick={onPause}
            aria-label={isPaused ? '继续' : '暂停'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <button
            className="touch-btn"
            onClick={() => onDirection('RIGHT')}
            aria-label="右移"
          >
            ▶
          </button>
        </div>
        <div className="touch-row">
          <button
            className="touch-btn"
            onClick={() => onDirection('DOWN')}
            aria-label="下移"
          >
            ▼
          </button>
        </div>
      </div>

      {/* 桌面端快捷键提示 */}
      <div className="keyboard-hints">
        <div className="hint-item">
          <kbd>↑↓←→</kbd> / <kbd>WASD</kbd> 移动
        </div>
        <div className="hint-item">
          <kbd>Space</kbd> {isPlaying ? '暂停/继续' : ''}
        </div>
      </div>
    </div>
  );
}
