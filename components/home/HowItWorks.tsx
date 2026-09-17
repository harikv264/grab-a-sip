import { STEPS } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade" />
      <div className="section">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="chip">How it works</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
              From hello to <span className="gradient-text">first sip</span> in
              a day
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg text-muted">
              No app to download, no complicated checkout. It all happens over a
              quick WhatsApp chat.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full rounded-4xl glass p-7">
                <span className="font-display text-5xl font-bold text-white/10">
                  {s.n}
                </span>
                <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
