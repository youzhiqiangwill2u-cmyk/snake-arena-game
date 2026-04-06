import { useState, useEffect, useCallback, useRef } from 'react';
import GameCanvas from '../components/game/GameCanvas';
import ScoreBoard from '../components/game/ScoreBoard';
import GameControls from '../components/game/GameControls';
import GameOverModal from '../components/game/GameOverModal';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { useGameRecords } from '../hooks/useGameRecords';
import { useAuth } from '../contexts/AuthContext';
import type { Direction } from '../types';

/**
 * 游戏主页
 * NOTE: 整合游戏画布、分数面板、控制按钮和结果弹窗
 */
export default function GamePage() {
  const { user } = useAuth();
  const { gameState, restart, setDirection, getDurationSeconds } = useSnakeGame();
  const { saveRecord } = useGameRecords();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 防止重复保存
  const hasSavedRef = useRef(false);

  /**
   * 游戏结束时自动保存分数
   */
  useEffect(() => {
    if (gameState.status === 'GAME_OVER' && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      
      // 测试模式下跳过数据库保存
      if (user.id === '00000000-0000-0000-0000-000000000000') {
        setSaved(true);
        return;
      }

      setSaving(true);
      saveRecord({
        userId: user.id,
        score: gameState.score,
        durationSeconds: getDurationSeconds(),
        snakeLength: gameState.snake.length,
      }).then(() => {
        setSaving(false);
        setSaved(true);
      });
    }
  }, [gameState.status, user, gameState.score, gameState.snake.length, getDurationSeconds, saveRecord]);

  /**
   * 重新开始游戏
   */
  const handleRestart = useCallback(() => {
    hasSavedRef.current = false;
    setSaved(false);
    setSaving(false);
    restart();
  }, [restart]);

  /**
   * 暂停/继续切换
   */
  const handlePause = useCallback(() => {
    // 通过模拟空格键事件来触发暂停/继续
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  }, []);

  /**
   * 触摸方向控制
   */
  const handleDirection = useCallback((dir: Direction) => {
    setDirection(dir);
  }, [setDirection]);

  return (
    <div className="game-page">
      <div className="game-area">
        <ScoreBoard gameState={gameState} />
        <div className="canvas-wrapper">
          <GameCanvas gameState={gameState} />
        </div>
        <GameControls
          onDirection={handleDirection}
          onPause={handlePause}
          isPaused={gameState.status === 'PAUSED'}
          isPlaying={gameState.status === 'PLAYING'}
        />
      </div>

      {gameState.status === 'GAME_OVER' && (
        <GameOverModal
          score={gameState.score}
          snakeLength={gameState.snake.length}
          onRestart={handleRestart}
          saving={saving}
          saved={saved}
        />
      )}
    </div>
  );
}
