// src/components/StarField.tsx
import { useEffect, useRef } from "react";

interface Star {
  x: number; y: number; r: number; vx: number; vy: number;
  a: number; t: number; tv: number; color: string; glow: boolean;
}

const PALETTE = ["255,255,255", "255,255,255", "150,235,255", "200,175,255", "255,160,225"] as const;

function createStars(w: number, h: number): Star[] {
  const count = Math.max(50, Math.min(140, Math.round((w * h) / 10000)));
  return Array.from({ length: count }, () => {
    const glow = Math.random() < 0.16;
    const big = Math.random() ** 2.2;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: glow ? 1.6 + Math.random() * 1.2 : 0.7 + big * 1.9,
      vx: (Math.random() - 0.5) * 0.14,
      vy: Math.random() * 0.2 + 0.04,
      a: 0.6 + Math.random() * 0.4,
      t: Math.random() * Math.PI * 2,
      tv: 0.012 + Math.random() * 0.02,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      glow,
    };
  });
}

interface StarFieldProps { active: boolean; reduceMotion: boolean }

/** Estrellas animadas (solo tema oscuro). Con `active=false` no corre ningún frame. */
export function StarField({ active, reduceMotion }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !active) return;

    let w = 0, h = 0, raf = 0, resizeTimer = 0;
    let stars: Star[] = [];

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(w, h);
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        if (!reduceMotion) {
          s.x += s.vx; s.y += s.vy; s.t += s.tv;
          if (s.y > h + 6) { s.y = -6; s.x = Math.random() * w; }
          if (s.x < -6) s.x = w + 6; else if (s.x > w + 6) s.x = -6;
        }
        const alpha = Math.min(1, s.a * (0.7 + 0.3 * Math.sin(s.t)));
        if (s.glow) {
          const radius = s.r * 6;
          const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius);
          gradient.addColorStop(0, `rgba(${s.color},${(alpha * 0.55).toFixed(3)})`);
          gradient.addColorStop(1, `rgba(${s.color},0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${s.color},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (): void => { draw(); raf = requestAnimationFrame(loop); };
    const start = (): void => { if (!reduceMotion && !document.hidden && !raf) loop(); };
    const pause = (): void => { cancelAnimationFrame(raf); raf = 0; };
    const onVisibility = (): void => (document.hidden ? pause() : start());
    const onResize = (): void => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { resize(); draw(); }, 150);
    };

    resize();
    draw();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      pause();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ctx.clearRect(0, 0, w, h);
    };
  }, [active, reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" />;
}
