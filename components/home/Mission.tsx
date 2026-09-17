import { MISSION } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

export function Mission() {
  return (
    <section id="mission" className="section scroll-mt-24 py-24 sm:py-32">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left — story */}
        <div>
          <Reveal>
            <span className="chip">{MISSION.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {MISSION.heading}
            </h2>
          </Reveal>
          <div className="mt-6 space-y-4">
            {MISSION.body.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p className="text-lg text-muted">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right — pillars */}
        <div className="flex flex-col gap-4">
          {MISSION.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="group flex items-start gap-5 rounded-4xl glass p-6 transition-all hover:border-white/25 hover:bg-white/[0.06]">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-white/10 to-white/0 text-2xl">
                  {pillar.emoji}
                </span>
                <div>
                  <h3 className="text-xl font-bold">{pillar.title}</h3>
                  <p className="mt-1.5 text-muted">{pillar.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
