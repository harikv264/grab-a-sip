"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, DEFAULT_COUNTRY, combineE164 } from "@/lib/countries";

export default function AppLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [dial, setDial] = useState(DEFAULT_COUNTRY.dial);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const body =
      mode === "email"
        ? { email: email.trim(), password }
        : { phone: combineE164(dial, phone), password };
    if ((mode === "email" ? !body.email : !body.phone) || !password) {
      setError(
        mode === "email"
          ? "Enter your email and password."
          : "Enter a valid phone number and password."
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/app/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }
      const dest =
        data.role === "rider"
          ? "/rider"
          : data.role === "customer"
          ? "/me"
          : data.role === "admin"
          ? "/admin"
          : "/app/no-access";
      router.push(dest);
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
          <h1 className="font-display text-2xl font-bold">Grab A Sip</h1>
          <p className="mt-1 text-sm text-muted">Sign in to your account.</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-4xl glass p-6">
          {mode === "phone" ? (
            <label className="text-sm">
              <span className="mb-1 block text-muted">Phone number</span>
              <div className="flex gap-2">
                <select
                  value={dial}
                  onChange={(e) => setDial(e.target.value)}
                  aria-label="Country code"
                  className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-cream outline-none transition focus:border-lime/60"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.dial}>
                      {c.flag} +{c.dial}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-lime/60"
                />
              </div>
            </label>
          ) : (
            <label className="text-sm">
              <span className="mb-1 block text-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-lime/60"
              />
            </label>
          )}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "phone" ? "email" : "phone");
              setError(null);
            }}
            className="-mt-1 self-start text-xs text-lime/80 underline-offset-2 hover:underline"
          >
            {mode === "phone" ? "Use email instead" : "Use phone instead"}
          </button>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-lime/60"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-berry/15 px-3 py-2 text-sm text-berry">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-1 disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted/70">
          Accounts are created by Grab A Sip. Contact us on WhatsApp if you need
          access.
        </p>
      </div>
    </div>
  );
}
