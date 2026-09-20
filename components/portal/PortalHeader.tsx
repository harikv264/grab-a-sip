"use client";

import { useRouter } from "next/navigation";

export function PortalHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/app/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-lime via-mango to-berry text-lg">
            🥤
          </span>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold">{title}</div>
            {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
          </div>
        </div>
        <button
          onClick={signOut}
          className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-cream transition hover:border-white/30 hover:bg-white/5"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
