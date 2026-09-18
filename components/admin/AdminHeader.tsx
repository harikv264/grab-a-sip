"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function AdminHeader({ email }: { email: string }) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-lime via-mango to-berry text-lg">
            🥤
          </span>
          <span className="font-display font-bold">
            Grab<span className="text-lime">A</span>Sip{" "}
            <span className="font-sans text-sm font-normal text-muted">
              · Admin
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted sm:inline">{email}</span>
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
