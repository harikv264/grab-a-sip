import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Products — Grab A Sip",
  description:
    "Explore Grab A Sip's fruit bowls and cold-pressed juices: Small & Large Sip Bowls, ABC Everyday, and the Classic Juice Plan.",
};

export default function ProductsPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Our products"
        title={
          <>
            Freshly made, <span className="gradient-text">every box</span>
          </>
        }
        subtitle="Four signature ways to sip fresh — from loaded fruit bowls to daily cold-pressed juices. Every one made the morning it's delivered."
      />

      <section className="section pt-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bowl comparison note */}
      <section className="section pt-16">
        <Reveal>
          <div className="rounded-4xl glass p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-center">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Small or Large?
                </h2>
                <p className="mt-3 text-muted">
                  Same wholesome recipe — four fruits, a protein, a veggie and a
                  dry-fruit mix. The only difference is how much lands in your
                  bowl.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-gradient-to-br from-mango/20 to-transparent p-6">
                  <p className="text-sm uppercase tracking-widest text-muted">
                    Small Bowl
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold">
                    390–420g
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Perfect for one · ₹1,699/mo
                  </p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-lime/20 to-transparent p-6">
                  <p className="text-sm uppercase tracking-widest text-muted">
                    Large Bowl
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold">
                    550–590g
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Big appetite · ₹2,199/mo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
