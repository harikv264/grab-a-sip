/**
 * A living gradient-mesh backdrop — slow drifting neon blobs behind a section.
 * Purely decorative and CSS-driven (no JS), so it's safe in server components.
 */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute left-[-10%] top-[-30%] h-72 w-72 animate-blob rounded-full bg-lime/20 blur-[90px]" />
      <div className="absolute right-[-8%] top-[-10%] h-80 w-80 animate-blob rounded-full bg-berry/20 blur-[100px] [animation-delay:5s]" />
      <div className="absolute bottom-[-40%] left-[35%] h-72 w-72 animate-blob rounded-full bg-grape/20 blur-[90px] [animation-delay:9s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(11,10,18,0.55))]" />
    </div>
  );
}
