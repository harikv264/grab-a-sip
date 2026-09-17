import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle } from "@/components/icons";
import { BRAND, NAV_LINKS, whatsappLink } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10">
      {/* glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-full bg-lime/10 blur-3xl" />

      <div className="section relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/mascot.png"
                alt="Grab A Sip mascot"
                width={44}
                height={68}
                className="h-14 w-auto"
              />
              <span className="font-display text-xl font-bold">
                Grab<span className="text-lime">A</span>Sip
              </span>
            </div>
            <p className="mt-4 max-w-sm text-muted">
              {BRAND.tagline} Cold-pressed juices and loaded fruit bowls,
              delivered fresh across the week.
            </p>
            <a
              href={whatsappLink("Hi Grab A Sip! I'd like to start a plan.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              Start your plan
            </a>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted">
              Explore
            </h4>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-cream/80 transition-colors hover:text-lime"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted">
              Say hello
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/80 transition-colors hover:text-lime"
                >
                  <MessageCircle size={16} /> {BRAND.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/80 transition-colors hover:text-lime"
                >
                  <Instagram size={16} /> @grabasip
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted">
              {BRAND.founder}
              <br />
              <span className="text-muted/70">{BRAND.founderRole}</span>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Grab A Sip. Freshly made, always.</p>
          <p>Delivered Mon–Sat · Made with real fruit 🍊</p>
        </div>
      </div>
    </footer>
  );
}
