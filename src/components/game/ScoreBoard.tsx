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
        <span className="score-label">得分</span>
        <span className="score-value score-value--primary">{gameState.score}</span>
      </div>
      <div className="score-item">
        <span className="score-label">长度</span>
        <span className="score-value">{gameState.snake.length}</span>
      </div>
      <div className="score-item">
        <span className="score-label">速度</span>
        <span className="score-value score-value--speed">
          {Math.round((1000 / gameState.speed) * 10) / 10}/s
        </span>
      </div>
    </div>
  );
}
