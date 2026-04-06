import type { GameState } from '../../types';

interface ScoreBoardProps {
  gameState: GameState;
}

/**
 * 实时分数显示组件
 */
export default function ScoreBoard({ gameState }: ScoreBoardProps) {
  return (
    <div className="score-board">
      <div className="score-item">
        <span className="score-label" style={{ fontSize: '0.65rem', color: 'var(--text-low-em)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>POINTS</span>
        <span className="score-value">{gameState.score}</span>
      </div>
      <div className="score-item">
        <span className="score-label" style={{ fontSize: '0.65rem', color: 'var(--text-low-em)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>LENGTH</span>
        <span className="score-value" style={{ color: 'var(--accent-secondary)' }}>{gameState.snake.length}</span>
      </div>
      <div className="score-item">
        <span className="score-label" style={{ fontSize: '0.65rem', color: 'var(--text-low-em)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>VELOCITY</span>
        <span className="score-value" style={{ color: 'var(--text-high-em)' }}>
          {Math.round((1000 / gameState.speed) * 10) / 10} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>u/s</span>
        </span>
      </div>
    </div>
  );
}

