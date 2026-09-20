"use client";

import { useRef } from "react";

/**
 * A button/link that gently drifts toward the cursor, then springs back.
 * Renders an <a>. Ignored on touch / reduced-motion.
 */
export function MagneticButton({
  children,
  href,
  className,
  strength = 0.4,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  strength?: number;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`[transition:transform_.35s_cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transform-none ${
        className ?? ""
      }`}
      {...rest}
    >
      {children}
    </a>
  );
}
