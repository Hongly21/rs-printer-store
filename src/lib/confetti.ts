'use client';

export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#0284c7', '#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const piecesCount = 80;
  const pieces: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    angle: number;
    vAngle: number;
    alpha: number;
  }> = [];

  for (let i = 0; i < piecesCount; i++) {
    pieces.push({
      x: width * 0.5 + (Math.random() - 0.5) * 120,
      y: height * 0.45,
      w: Math.random() * 8 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18 - 4,
      angle: Math.random() * 360,
      vAngle: (Math.random() - 0.5) * 12,
      alpha: 1,
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();
  const duration = 2800;

  function render() {
    const elapsed = Date.now() - startTime;
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    let activePieces = 0;

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // friction
      p.angle += p.vAngle;

      if (elapsed > 1200) {
        p.alpha = Math.max(0, 1 - (elapsed - 1200) / (duration - 1200));
      }

      if (p.alpha > 0) {
        activePieces++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (elapsed < duration && activePieces > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
