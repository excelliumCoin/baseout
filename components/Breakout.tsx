'use client';
import { useEffect, useRef, useState } from 'react';

export function Breakout({ onGameOver }: { onGameOver: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);

  const [, setScoreState] = useState(0);
  const scoreRef = useRef(0);
  const setScore = (v: number) => { scoreRef.current = v; setScoreState(v); };

  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let anim = 0;

    const W = 360, H = 520;
    canvas.width = W; canvas.height = H;

    const paddle = { x: W/2 - 40, y: H - 30, w: 80, h: 12, speed: 6 };
    const ball = { x: W/2, y: H/2, r: 6, vx: 3, vy: -3 };
    const rows = 6, cols = 8, bw = 40, bh = 14, pad = 6, offx = 16, offy = 60;

    const bricks: {x:number;y:number;alive:boolean}[] = [];
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++)
      bricks.push({x:offx+c*(bw+pad), y:offy+r*(bh+pad), alive:true});

    const key = { left:false, right:false };
    const down = (e: KeyboardEvent) => { if (e.key==='ArrowLeft') key.left=true; if (e.key==='ArrowRight') key.right=true; };
    const up   = (e: KeyboardEvent) => { if (e.key==='ArrowLeft') key.left=false; if (e.key==='ArrowRight') key.right=false; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);

    function loop() {
      anim = requestAnimationFrame(loop);
      ctx.fillStyle = '#0b0f1a'; ctx.fillRect(0,0,W,H);

      if (key.left) paddle.x -= paddle.speed;
      if (key.right) paddle.x += paddle.speed;
      paddle.x = Math.max(0, Math.min(W-paddle.w, paddle.x));
      ctx.fillStyle = '#ffffff'; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
      if (ball.y < ball.r) ball.vy *= -1;

      if (ball.y + ball.r >= paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w && ball.vy > 0) {
        ball.vy *= -1;
        const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vx = 4 * hit;
      }

      let aliveCount = 0;
      for (const b of bricks) {
        if (!b.alive) continue;
        aliveCount++;
        const withinX = ball.x > b.x - ball.r && ball.x < b.x + bw + ball.r;
        const withinY = ball.y > b.y - ball.r && ball.y < b.y + bh + ball.r;
        if (withinX && withinY) {
          b.alive = false;
          setScore(scoreRef.current + 10);
          ball.vy *= -1;
          aliveCount--;
          break;
        }
      }

      if (aliveCount === 0) {
        for (const b of bricks) b.alive = true;
        setScore(scoreRef.current + 100);
        ball.vx *= 1.1;
        ball.vy = -Math.abs(ball.vy) * 1.1;
        ball.x = W/2; ball.y = H/2;
      }

      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fillStyle = '#ffffff'; ctx.fill();

      for (const b of bricks) if (b.alive) { ctx.fillStyle = '#7dd3fc'; ctx.fillRect(b.x,b.y,bw,bh); }

      ctx.font = '14px ui-sans-serif'; ctx.fillStyle = '#ffffff';
      ctx.fillText(`Score: ${scoreRef.current}`, 12, 24);

      if (ball.y > H + 20) {
        cancelAnimationFrame(anim);
        window.removeEventListener('keydown', down);
        window.removeEventListener('keyup', up);
        onGameOver(scoreRef.current);
      }
    }

    loop();
    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [running, onGameOver]);

  return (
    <div className="rounded-2xl p-3 bg-white/5">
      <canvas ref={canvasRef} className="rounded-lg block mx-auto" width={360} height={520} />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm opacity-80">Use arrow keys to play</span>
        <button onClick={() => setRunning(true)} className="px-3 py-1.5 rounded-lg bg-white/10">Start</button>
      </div>
    </div>
  );
}
