import type { Metadata } from "next";
import { CalendarDays, Pause, Truck, MessageCircle } from "@/components/icons";
import {
  PRODUCTS,
  DELIVERY_DETAIL,
  whatsappLink,
} from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Plans & Pricing — Grab A Sip",
  description:
    "Flexible monthly subscriptions from ₹1,350. Delivered Monday to Saturday, pause up to 5 days, 24–26 fresh boxes a month.",
};

const FAQS = [
  {
    q: "How do I subscribe?",
    a: "Message us on WhatsApp and share your delivery location. If we deliver to your area, we'll confirm the details and set up your plan — no app or online checkout needed.",
  },
  {
    q: "Which days do you deliver?",
    a: "We deliver Monday to Saturday. We don't deliver on Sundays or public holidays.",
  },
  {
    q: "How many boxes will I get in a month?",
    a: "A festival-free month gets you 26 boxes. If there's one public holiday you'll get 25, and in months with two or more holidays we cap it at two — so you always receive at least 24 boxes.",
  },
  {
    q: "Can I pause my subscription?",
    a: "Yes. You can pause your plan for up to 5 days within a monthly subscription, whenever you need — just let us know on WhatsApp.",
  },
];

export default function PlansPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Plans & pricing"
        title={
          <>
            Simple plans, <span className="gradient-text">serious fresh</span>
          </>
        }
        subtitle="Every plan is a flexible monthly subscription — no lock-ins, no hidden fees. Pick your flavour and start over WhatsApp."
      />

      {/* Plan cards */}
      <section className="section pt-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Delivery + pause info */}
      <section className="section pt-20">
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal>
            <InfoCard
              icon={<Truck size={22} />}
              title="Delivered Mon–Sat"
              body="Fresh to your door six days a week. We rest on Sundays and public holidays so every box arrives freshly made."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <InfoCard
              icon={<CalendarDays size={22} />}
              title="24–26 boxes / month"
              body="You get the maximum deliveries your month allows, with a fair cap during festive weeks."
            />
          </Reveal>
          <Reveal delay={0.16}>
            <InfoCard
              icon={<Pause size={22} />}
              title="Pause up to 5 days"
              body="Travelling or away? Pause your plan for up to five days in a monthly subscription — no charge, no hassle."
            />
          </Reveal>
        </div>
      </section>

      {/* How boxes are counted */}
      <section className="section pt-16">
        <Reveal>
          <div className="rounded-4xl glass p-8 sm:p-10">
            <h2 className="text-3xl font-bold sm:text-4xl">
              How your monthly boxes are counted
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              We keep it transparent. Here&apos;s exactly how many fresh boxes
              land at your door each month:
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { n: "26", label: "No festivals", note: DELIVERY_DETAIL[0] },
                { n: "25", label: "One holiday", note: DELIVERY_DETAIL[1] },
                { n: "24", label: "Two+ holidays", note: DELIVERY_DETAIL[2] },
              ].map((b) => (
                <div
                  key={b.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="font-display text-5xl font-bold text-lime">
                    {b.n}
                  </div>
                  <p className="mt-2 font-semibold">{b.label}</p>
                  <p className="mt-1 text-sm text-muted">{b.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section pt-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              Questions, answered
            </h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group rounded-3xl glass p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 text-lime transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-16">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-4xl bg-gradient-to-br from-lime/15 via-transparent to-berry/15 p-10 text-center sm:p-14">
            <h2 className="max-w-2xl text-balance text-3xl font-bold sm:text-4xl">
              Found your plan? Let&apos;s get you sipping.
            </h2>
            <a
              href={whatsappLink("Hi Grab A Sip! I'd like to start a plan.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 text-lg"
            >
              <MessageCircle size={20} strokeWidth={2.5} />
              Start on WhatsApp
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="h-full rounded-4xl glass p-7">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/15 text-lime">
        {icon}
      </span>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted">{body}</p>
    </div>
  );
}
