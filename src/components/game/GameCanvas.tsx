import { useRef, useEffect, useCallback } from 'react';
import type { GameState } from '../../types';
import {
  CELL_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRID_COLS,
  GRID_ROWS,
  THEME,
} from '../../lib/constants';

interface GameCanvasProps {
  gameState: GameState;
}

/**
 * 游戏画布组件
 * NOTE: 使用 Canvas 2D 渲染蛇、食物和网格背景，支持霓虹发光效果
 */
export default function GameCanvas({ gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 食物脉冲动画帧计数器
  const frameRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  /**
   * 绘制一帧画面
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    frameRef.current++;

    // 清空画布
    ctx.fillStyle = THEME.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制网格线
    ctx.strokeStyle = THEME.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= GRID_ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      ctx.stroke();
    }

    // 绘制食物（带脉冲发光）
    const pulse = Math.sin(frameRef.current * 0.08) * 0.3 + 0.7;
    const foodX = gameState.food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodY = gameState.food.y * CELL_SIZE + CELL_SIZE / 2;
    const foodRadius = (CELL_SIZE / 2 - 2) * pulse;

    // 外层光晕
    const glowGradient = ctx.createRadialGradient(
      foodX, foodY, 0,
      foodX, foodY, CELL_SIZE * 1.2
    );
    glowGradient.addColorStop(0, THEME.foodGlow);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(
      foodX - CELL_SIZE * 1.2,
      foodY - CELL_SIZE * 1.2,
      CELL_SIZE * 2.4,
      CELL_SIZE * 2.4
    );

    // 食物实体
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fillStyle = THEME.food;
    ctx.shadowColor = THEME.food;
    ctx.shadowBlur = 12 * pulse;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 绘制蛇身
    gameState.snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      const padding = 1;

      // 蛇身颜色渐变：头部最亮，尾部暗淡
      const ratio = index / Math.max(gameState.snake.length - 1, 1);
      const r = Math.round(0 + ratio * 0);
      const g = Math.round(255 - ratio * 100);
      const b = Math.round(136 - ratio * 60);
      const color = `rgb(${r}, ${g}, ${b})`;

      // 圆角矩形
      const radius = index === 0 ? 6 : 4;
      ctx.beginPath();
      ctx.roundRect(
        x + padding,
        y + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2,
        radius
      );
      ctx.fillStyle = color;

      // 蛇头发光效果
      if (index === 0) {
        ctx.shadowColor = THEME.snakeHead;
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // 蛇头眼睛
      if (index === 0) {
        ctx.fillStyle = THEME.background;
        const eyeSize = 3;
        const eyeOffset = 5;
        const dir = gameState.direction;
        let eye1X: number, eye1Y: number, eye2X: number, eye2Y: number;

        const cx = x + CELL_SIZE / 2;
        const cy = y + CELL_SIZE / 2;

        if (dir === 'RIGHT') {
          eye1X = cx + eyeOffset; eye1Y = cy - 4;
          eye2X = cx + eyeOffset; eye2Y = cy + 4;
        } else if (dir === 'LEFT') {
          eye1X = cx - eyeOffset; eye1Y = cy - 4;
          eye2X = cx - eyeOffset; eye2Y = cy + 4;
        } else if (dir === 'UP') {
          eye1X = cx - 4; eye1Y = cy - eyeOffset;
          eye2X = cx + 4; eye2Y = cy - eyeOffset;
        } else {
          eye1X = cx - 4; eye1Y = cy + eyeOffset;
          eye2X = cx + 4; eye2Y = cy + eyeOffset;
        }

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 游戏状态覆盖层
    if (gameState.status === 'IDLE') {
      drawOverlay(ctx, '按方向键开始游戏', 'WASD 或 ↑↓←→');
    } else if (gameState.status === 'PAUSED') {
      drawOverlay(ctx, '已暂停', '按空格键继续');
    } else if (gameState.status === 'GAME_OVER') {
      drawOverlay(ctx, '游戏结束', `得分: ${gameState.score}`);
    }

    // 持续动画
    if (gameState.status !== 'GAME_OVER') {
      animFrameRef.current = requestAnimationFrame(draw);
    }
  }, [gameState]);

  /**
   * 绘制半透明覆盖层 + 居中文字
   */
  function drawOverlay(ctx: CanvasRenderingContext2D, title: string, subtitle: string) {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.75)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillStyle = THEME.neonGreen;
    ctx.shadowColor = THEME.neonGreen;
    ctx.shadowBlur = 15;
    ctx.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 16);
    ctx.shadowBlur = 0;

    ctx.font = '14px "Inter", sans-serif';
    ctx.fillStyle = THEME.textSecondary;
    ctx.fillText(subtitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 16);
  }

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="game-canvas"
    />
  );
}
