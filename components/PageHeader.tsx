import { Reveal } from "@/components/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <header className="relative overflow-hidden pt-36 pb-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-grape/20 blur-[120px]" />
      </div>
      <div className="section text-center">
        <Reveal>
          <span className="chip">{eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mx-auto mt-5 max-w-4xl text-balance text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </header>
  );
}
