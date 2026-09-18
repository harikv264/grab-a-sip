"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateDeliveriesButton({ date }: { date: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(
        `/api/admin/deliveries/generate?date=${encodeURIComponent(date)}`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || data?.error || "Could not generate.");
      } else if (data.reason) {
        setMsg(data.reason);
      } else {
        setMsg(`Created ${data.created ?? 0} · skipped ${data.skipped ?? 0}`);
        router.refresh();
      }
    } catch {
      setMsg("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={run} disabled={busy} className="btn-primary text-sm disabled:opacity-60">
        {busy ? "Generating…" : "Generate deliveries"}
      </button>
      {msg && <span className="text-sm text-muted">{msg}</span>}
    </div>
  );
}
