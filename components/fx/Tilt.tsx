"use client";

import { useRef } from "react";

/**
 * Pointer-reactive 3D tilt with a moving glare highlight.
 * Wraps any card; disables itself on touch / reduced-motion.
 */
export function Tilt({
  children,
  className,
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
        2
      )}deg) translateZ(0)`;
      if (glare.current) {
        glare.current.style.opacity = "1";
        glare.current.style.background = `radial-gradient(220px circle at ${(px * 100).toFixed(
          0
        )}% ${(py * 100).toFixed(0)}%, rgba(255,255,255,0.16), transparent 60%)`;
      }
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    if (glare.current) glare.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`relative [transform-style:preserve-3d] [transition:transform_.5s_cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transform-none ${
        className ?? ""
      }`}
    >
      {children}
      <div
        ref={glare}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
