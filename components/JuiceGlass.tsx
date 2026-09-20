"use client";

import { useEffect, useId, useState } from "react";

const WAVE =
  "M-20,22 Q0,17 20,22 T60,22 T100,22 T140,22 T180,22 T220,22 T260,22 L260,152 L-20,152 Z";
const INTERIOR = "M25,18 L95,18 L86,145 Q85,149 81,149 L39,149 Q35,149 34,145 Z";
const FILL_RANGE = 131; // 18 → 149

/**
 * A glass that fills with juice to `pct` (0–100), plan-coloured, with an
 * animated wavy surface, rising bubbles, a straw and a fruit garnish.
 * The signature Grab A Sip motif — used for subscription progress.
 */
export function JuiceGlass({
  pct,
  color,
  size = 160,
  garnishColor = "#FF6B2C",
  showPct = false,
}: {
  pct: number;
  color: string;
  size?: number;
  garnishColor?: string;
  showPct?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const target = Math.max(0, Math.min(100, pct));
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLevel(target), 60);
    return () => clearTimeout(t);
  }, [target]);

  const translateY = ((100 - level) / 100) * FILL_RANGE;

  return (
    <svg
      width={size}
      height={size * (160 / 120)}
      viewBox="0 0 120 160"
      fill="none"
      role="img"
      aria-label={`Glass ${Math.round(target)}% full`}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.98" />
          <stop offset="1" stopColor={color} stopOpacity="0.72" />
        </linearGradient>
        <clipPath id={`c-${id}`}>
          <path d={INTERIOR} />
        </clipPath>
      </defs>

      {/* empty-glass tint */}
      <path d={INTERIOR} fill="rgba(255,255,255,0.035)" />

      {/* liquid */}
      <g clipPath={`url(#c-${id})`}>
        <g
          style={{
            transform: `translateY(${translateY}px)`,
            transition: "transform 1.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <path className="juice-wave-slow" d={WAVE} fill={`url(#g-${id})`} opacity={0.5} />
          <path className="juice-wave" d={WAVE} fill={`url(#g-${id})`} />
          {/* bubbles */}
          <circle className="juice-bubble" cx="48" cy="135" r="2.4" fill="#ffffff" opacity={0.5} style={{ animationDelay: "0s" }} />
          <circle className="juice-bubble" cx="66" cy="140" r="1.8" fill="#ffffff" opacity={0.5} style={{ animationDelay: "1.1s" }} />
          <circle className="juice-bubble" cx="57" cy="132" r="1.5" fill="#ffffff" opacity={0.5} style={{ animationDelay: "2.2s" }} />
        </g>
      </g>

      {/* straw */}
      <line x1="72" y1="6" x2="54" y2="120" stroke="#F6F4FF" strokeWidth="6" strokeLinecap="round" opacity={0.9} />
      <line x1="72" y1="6" x2="54" y2="120" stroke={garnishColor} strokeWidth="6" strokeLinecap="round" strokeDasharray="10 10" opacity={0.5} />

      {/* glass outline + shine */}
      <path d={INTERIOR} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <path d="M32,24 L40,140" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" />

      {/* fruit garnish on the rim */}
      <g transform="translate(90,18) rotate(12)">
        <circle r="11" fill={garnishColor} />
        <circle r="7.5" fill="#ffffff" opacity={0.35} />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
        <line x1="-6" y1="-6" x2="6" y2="6" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
        <line x1="-6" y1="6" x2="6" y2="-6" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
      </g>

      {showPct && (
        <text
          x="60"
          y="90"
          textAnchor="middle"
          fontSize="26"
          fontWeight="800"
          fill="#0B0A12"
          style={{ paintOrder: "stroke", stroke: "rgba(255,255,255,0.55)", strokeWidth: 3 }}
        >
          {Math.round(target)}%
        </text>
      )}
    </svg>
  );
}
