"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A tiny trend line with a soft area fill that "draws in" on mount.
 * Pure inline SVG — no chart lib. Great for KPI cards.
 */
export function Sparkline({
  data,
  color = "#C6FF4F",
  width = 132,
  height = 40,
  strokeWidth = 2,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}) {
  const id = useId().replace(/:/g, "");
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  const pad = 3;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = data.length ? data : [0, 0];
  const max = Math.max(...pts, 1);
  const min = Math.min(...pts, 0);
  const span = max - min || 1;
  const step = pts.length > 1 ? w / (pts.length - 1) : w;

  const coords = pts.map((v, i) => {
    const x = pad + i * step;
    const y = pad + h - ((v - min) / span) * h;
    return [x, y] as const;
  });

  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${(pad + w).toFixed(1)},${(pad + h).toFixed(1)} L${pad.toFixed(
    1
  )},${(pad + h).toFixed(1)} Z`;

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [line]);

  const last = coords[coords.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={`spk-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.32" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spk-${id})`} opacity={len ? 1 : 0} style={{ transition: "opacity .6s .4s" }} />
      <path
        ref={pathRef}
        d={line}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          len
            ? {
                strokeDasharray: len,
                strokeDashoffset: len,
                animation: "spkDraw 1.1s .15s cubic-bezier(0.22,1,0.36,1) forwards",
              }
            : undefined
        }
      />
      {last && (
        <circle cx={last[0]} cy={last[1]} r={2.6} fill={color} opacity={len ? 1 : 0} style={{ transition: "opacity .3s 1.1s" }} />
      )}
    </svg>
  );
}
