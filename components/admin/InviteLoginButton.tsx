"use client";

import { useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, combineE164 } from "@/lib/countries";

/** Admin action: create a phone login for a rider/customer and link the role. */
export function InviteLoginButton({
  kind,
  id,
  phone,
}: {
  kind: "rider" | "customer";
  id: string;
  phone: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [dial, setDial] = useState(DEFAULT_COUNTRY.dial);
  const [result, setResult] = useState<{ phone: string; tempPassword: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const invite = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    // If the stored number is already E.164 (+…), use it; else apply the picked country.
    const raw = (phone ?? "").trim();
    const e164 = raw.startsWith("+") ? raw : combineE164(dial, raw);
    if (!e164) {
      setError("This record needs a valid phone number first.");
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, id, phone: e164 }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not create login.");
      } else {
        setResult({ phone: data.phone, tempPassword: data.tempPassword });
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="rounded-2xl border border-lime/30 bg-lime/10 p-4 text-sm">
        <p className="font-semibold text-lime">Login created ✓</p>
        <p className="mt-1 text-cream/90">
          Share these with the {kind}. They sign in at{" "}
          <span className="mono">/app/login</span>.
        </p>
        <div className="mt-2 space-y-1 font-mono text-cream">
          <div>Phone: {result.phone}</div>
          <div>Temp password: {result.tempPassword}</div>
        </div>
        <p className="mt-2 text-xs text-muted">
          (Temporary until phone-OTP is enabled.)
        </p>
      </div>
    );
  }

  const isE164 = (phone ?? "").trim().startsWith("+");
  return (
    <div>
      <div className="flex items-center gap-2">
        {!isE164 && (
          <select
            value={dial}
            onChange={(e) => setDial(e.target.value)}
            aria-label="Country code"
            className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-sm text-cream outline-none focus:border-lime/60"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.dial}>
                {c.flag} +{c.dial}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={invite}
          disabled={busy || !phone}
          className="btn-ghost text-sm disabled:opacity-50"
          title={!phone ? "Add a phone number first" : undefined}
        >
          {busy ? "Creating…" : "Invite login"}
        </button>
      </div>
      {!phone && (
        <p className="mt-1 text-xs text-muted">Add a phone number first.</p>
      )}
      {error && <p className="mt-2 text-sm text-berry">{error}</p>}
    </div>
  );
}
