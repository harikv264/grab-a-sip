import { BENEFITS } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

export function Benefits() {
  return (
    <section className="section py-24 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="chip">The good stuff</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            Why people <span className="gradient-text">stay subscribed</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted">
            Real ingredients, honest sourcing and a delivery you can actually
            rely on. Here&apos;s what a Grab A Sip habit looks like.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={(i % 3) * 0.08}>
            <div className="group h-full rounded-4xl glass p-7 transition-all hover:-translate-y-1 hover:border-white/25">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-2xl transition-transform group-hover:scale-110">
                {b.emoji}
              </span>
              <h3 className="mt-5 text-xl font-bold">{b.title}</h3>
              <p className="mt-2 text-muted">{b.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
