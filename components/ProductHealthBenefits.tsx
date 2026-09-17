import { PRODUCTS } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

/** Detailed "why it's good for you" panels, one per product. */
export function ProductHealthBenefits() {
  return (
    <section className="section pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="chip">Health benefits</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            What each one <span className="gradient-text">does for you</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted">
            Every product is built around function, not just flavour. Here&apos;s
            the good it does, product by product.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 space-y-5">
        {PRODUCTS.map((p, idx) => (
          <Reveal key={p.slug} delay={idx * 0.05}>
            <div className="overflow-hidden rounded-4xl glass p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr] lg:items-center">
                {/* Product label */}
                <div className="flex items-center gap-4">
                  <span
                    className={`grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ${p.gradient} text-3xl`}
                  >
                    {p.emoji}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold">{p.name}</h3>
                    <p className="text-sm text-muted">{p.kicker}</p>
                  </div>
                </div>

                {/* Benefit grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {p.healthBenefits.map((b) => (
                    <div key={b.title} className="flex gap-3">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl"
                        style={{ background: `${p.accent}1a` }}
                      >
                        {b.emoji}
                      </span>
                      <div>
                        <p className="font-semibold leading-tight">{b.title}</p>
                        <p className="mt-1 text-sm text-muted">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted/70">
          Wellbeing benefits are general and based on the natural properties of
          whole fruits and vegetables. Grab A Sip is fresh food, not a medical
          treatment.
        </p>
      </Reveal>
    </section>
  );
}
