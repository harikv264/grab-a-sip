import { INGREDIENT_BENEFITS } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

/** "What's inside works for you" — functional ingredient highlights. */
export function IngredientBenefits() {
  return (
    <section className="section py-24 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="chip">Functional by design</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            Every ingredient <span className="gradient-text">earns its spot</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted">
            We don&apos;t add anything just for taste. Each hero ingredient is
            chosen for what it does for your body.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INGREDIENT_BENEFITS.map((ing, i) => (
          <Reveal key={ing.name} delay={(i % 3) * 0.07}>
            <div className="group flex items-center gap-4 rounded-3xl glass p-5 transition-all hover:-translate-y-1 hover:border-white/25">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl transition-transform group-hover:scale-110"
                style={{ background: `${ing.accent}1f` }}
              >
                {ing.emoji}
              </span>
              <div>
                <p className="text-lg font-bold">{ing.name}</p>
                <p className="text-sm" style={{ color: ing.accent }}>
                  {ing.benefit}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
