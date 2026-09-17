import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export function ProductsPreview() {
  return (
    <section id="products" className="section scroll-mt-24 py-24 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <Reveal>
            <span className="chip">What&apos;s on the menu</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
              Four ways to <span className="gradient-text">sip fresh</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg text-muted">
              Loaded fruit bowls or cold-pressed juices — pick the one that fits
              your day.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <Link
            href="/products"
            className="btn-ghost shrink-0 whitespace-nowrap"
          >
            All products
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 4) * 0.06}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
