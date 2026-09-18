"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-lime via-mango to-berry text-2xl">
            🥤
          </div>
          <h1 className="font-display text-2xl font-bold">Grab A Sip · Admin</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your ops.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-4xl glass p-6"
        >
          <label className="text-sm">
            <span className="mb-1 block text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-lime/60"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-lime/60"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-berry/15 px-3 py-2 text-sm text-berry">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-1 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted/70">
          Access is invite-only. Ask the owner to add you in Supabase.
        </p>
      </div>
    </div>
  );
}
