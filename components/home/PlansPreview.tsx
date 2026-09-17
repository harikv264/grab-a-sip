import Link from "next/link";
import { ArrowRight, Check } from "@/components/icons";
import { PRODUCTS, DELIVERY_FACTS } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

export function PlansPreview() {
  return (
    <section id="plans" className="scroll-mt-24 py-24 sm:py-28">
      <div className="section">
        <div className="overflow-hidden rounded-5xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-8 sm:p-12">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* Left */}
            <div>
              <Reveal>
                <span className="chip">Monthly subscriptions</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
                  One simple plan,{" "}
                  <span className="gradient-text">endless freshness</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 max-w-lg text-lg text-muted">
                  Every plan is a flexible monthly subscription. Delivered Monday
                  to Saturday, pausable up to five days, and priced from just
                  ₹1,350 a month.
                </p>
              </Reveal>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {DELIVERY_FACTS.map((f, i) => (
                  <Reveal key={f.label} delay={0.12 + i * 0.06}>
                    <div className="rounded-3xl glass p-4 text-center">
                      <div className="font-display text-xl font-bold text-lime sm:text-2xl">
                        {f.value}
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                        {f.label}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.3}>
                <Link href="/plans" className="btn-primary mt-8">
                  Compare all plans
                  <ArrowRight size={18} />
                </Link>
              </Reveal>
            </div>

            {/* Right — price list */}
            <Reveal delay={0.15}>
              <div className="rounded-4xl glass-strong p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-muted">
                  Plans at a glance
                </p>
                <ul className="mt-5 divide-y divide-white/10">
                  {PRODUCTS.map((p) => (
                    <li
                      key={p.slug}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-xl">
                          {p.emoji}
                        </span>
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-muted">{p.kicker}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold">
                          ₹{p.price.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted">/ month</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-lime/10 px-4 py-3 text-sm text-lime">
                  <Check size={16} strokeWidth={3} />
                  No hidden fees. Cancel or pause anytime.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
