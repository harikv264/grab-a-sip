"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { label: "Leads", href: "/admin" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
  { label: "Deliveries", href: "/admin/deliveries" },
];

export function AdminHeader({
  email,
  role,
}: {
  email: string;
  role?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-lime via-mango to-berry text-lg">
              🥤
            </span>
            <span className="hidden font-display font-bold sm:inline">
              Grab<span className="text-lime">A</span>Sip{" "}
              <span className="font-sans text-sm font-normal text-muted">
                · Admin
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {TABS.map((t) => {
              const active =
                t.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-cream"
                      : "text-muted hover:text-cream"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {role && (
            <span className="hidden rounded-full bg-lime/15 px-2.5 py-0.5 text-xs font-semibold capitalize text-lime sm:inline">
              {role}
            </span>
          )}
          <span className="hidden text-muted md:inline">{email}</span>
          <button
            onClick={signOut}
            className="rounded-full border border-white/15 px-4 py-1.5 font-medium text-cream transition hover:border-white/30 hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
