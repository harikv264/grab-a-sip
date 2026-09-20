"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#C6FF4F", "#FFC542", "#FF3E9A", "#38F5C9", "#A855F7", "#FF6B2C"];

type Drop = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  rot: number;
  vr: number;
};

/**
 * A one-shot burst of juice droplets, fired whenever `active` turns true.
 * Overlays its parent (which must be positioned). Skips on reduced-motion.
 */
export function JuiceBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!active || fired.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    fired.current = true;

    const parent = canvas.parentElement;
    if (!parent) return;
    const w = (canvas.width = parent.clientWidth);
    const h = (canvas.height = parent.clientHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = w / 2;
    const cy = h * 0.42;
    const drops: Drop[] = Array.from({ length: 70 }, () => {
      const a = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 3,
        r: 3 + Math.random() * 5,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: 1,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
      };
    });

    let frame = 0;
    const maxFrames = 90;
    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        d.vy += 0.28; // gravity
        d.vx *= 0.99;
        d.x += d.vx;
        d.y += d.vy;
        d.rot += d.vr;
        d.life = Math.max(0, 1 - frame / maxFrames);
        ctx.globalAlpha = d.life;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        // teardrop-ish blob
        ctx.ellipse(d.x, d.y, d.r, d.r * 1.25, d.rot, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (frame < maxFrames) requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, w, h);
    };
    requestAnimationFrame(loop);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
