"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "@/components/icons";
import { NAV_LINKS, whatsappLink } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav className="section">
        <div
          className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 ${
            scrolled ? "glass-strong shadow-card" : "border border-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-lime via-mango to-berry text-lg shadow-glow transition-transform group-hover:scale-110">
              🥤
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Grab<span className="text-lime">A</span>Sip
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.href.split("#")[0]) &&
                    l.href !== "/#mission";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-cream"
                      : "text-muted hover:text-cream"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappLink("Hi Grab A Sip! I'd like to start a plan.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:shadow-glow hover:brightness-105 active:scale-95 sm:inline-flex"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              Order on WhatsApp
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid h-10 w-10 place-items-center rounded-full glass md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="mt-2 flex flex-col gap-1 rounded-3xl glass-strong p-3 md:hidden">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-2xl px-4 py-3 text-base font-medium text-cream/90 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={whatsappLink("Hi Grab A Sip! I'd like to start a plan.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-1"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              Order on WhatsApp
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
