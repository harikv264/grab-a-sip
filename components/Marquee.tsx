const ITEMS = [
  "Cold-pressed daily",
  "Zero added sugar",
  "Delivered Mon–Sat",
  "Real fruit only",
  "Pause anytime",
  "Loaded fruit bowls",
  "ABC everyday",
  "Seasonal & fresh",
];

export function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
      <div className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-lg font-medium text-cream/80">
              {item}
            </span>
            <span className="text-lime">✦</span>
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8"
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-lg font-medium text-cream/80">
              {item}
            </span>
            <span className="text-lime">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
