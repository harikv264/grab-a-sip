"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Pause = {
  id: string;
  startDate: string | null;
  days: number;
  note: string | null;
  createdAt: string | null;
};

const MAX = 5;

export function PausePanel({
  subscriptionId,
  pauseDaysUsed,
  pauses,
}: {
  subscriptionId: string;
  pauseDaysUsed: number;
  pauses: Pause[];
}) {
  const router = useRouter();
  const [days, setDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const remaining = Math.max(0, MAX - pauseDaysUsed);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/subscriptions/${subscriptionId}/pause`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          days: Number(days),
          startDate: startDate || null,
          note: note || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || "Could not record pause.");
        setSaving(false);
        return;
      }
      setDays("");
      setStartDate("");
      setNote("");
      setSaving(false);
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none transition focus:border-lime/60";

  return (
    <div className="rounded-4xl glass p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Pauses</h3>
        <span className="text-sm text-muted">
          <span className={remaining === 0 ? "text-berry" : "text-lime"}>
            {pauseDaysUsed}
          </span>{" "}
          / {MAX} days used
        </span>
      </div>

      {remaining > 0 ? (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-[100px_1fr_auto] sm:items-end">
          <label className="text-sm">
            <span className="mb-1 block text-muted">Days</span>
            <input
              type="number"
              min={1}
              max={remaining}
              required
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className={field}
              placeholder={`1–${remaining}`}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">From (optional)</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={field}
            />
          </label>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "…" : "Add pause"}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-berry">
          All {MAX} pause days for this cycle are used.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-2xl bg-berry/15 px-4 py-2 text-sm text-berry">
          {error}
        </p>
      )}

      {pauses.length > 0 && (
        <ul className="mt-4 divide-y divide-white/10 border-t border-white/10">
          {pauses.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
              <span>
                <span className="font-medium">{p.days} day{p.days > 1 ? "s" : ""}</span>
                {p.startDate ? (
                  <span className="text-muted"> · from {p.startDate}</span>
                ) : null}
                {p.note ? <span className="text-muted"> · {p.note}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
