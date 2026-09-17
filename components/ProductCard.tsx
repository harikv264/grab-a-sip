import { Check, MessageCircle } from "@/components/icons";
import { type Product, whatsappLink } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-4xl glass p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25">
      {/* accent glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: product.accent }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${product.gradient} text-3xl shadow-card`}
        >
          {product.emoji}
        </div>
        {product.badge && (
          <span className="chip border-white/20 text-cream">
            {product.badge}
          </span>
        )}
      </div>

      <div className="relative mt-6">
        <p className="text-sm font-medium uppercase tracking-widest text-muted">
          {product.kicker}
        </p>
        <h3 className="mt-1 text-2xl font-bold">{product.name}</h3>
        {product.weight && (
          <p className="mt-1 text-sm text-muted">{product.weight}</p>
        )}
      </div>

      <p className="relative mt-4 text-cream/75">{product.blurb}</p>

      <ul className="relative mt-6 space-y-2.5">
        {product.contents.map((c) => (
          <li key={c} className="flex items-center gap-3 text-sm text-cream/90">
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
              style={{ background: `${product.accent}22`, color: product.accent }}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            {c}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-7">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="ml-1 text-sm text-muted">{product.cadence}</span>
          </div>
          <a
            href={whatsappLink(
              `Hi Grab A Sip! I'm interested in the ${product.name} plan.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${product.name} on WhatsApp`}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-cream transition-all hover:bg-lime hover:text-ink"
          >
            <MessageCircle size={18} strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </div>
  );
}
