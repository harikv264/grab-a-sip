"use client";

import { useState } from "react";

type Holiday = { id: string; date: string; name: string | null };

export function HolidaysManager({ initial }: { initial: Holiday[] }) {
  const [holidays, setHolidays] = useState<Holiday[]>(initial);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date, name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || "Could not add holiday.");
      } else {
        setHolidays((h) =>
          [...h, data].sort((a, b) => b.date.localeCompare(a.date))
        );
        setDate("");
        setName("");
      }
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setHolidays((h) => h.filter((x) => x.id !== id));
    await fetch(`/api/admin/holidays/${id}`, { method: "DELETE" });
  };

  const field =
    "rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-lime/60";

  return (
    <>
      <form onSubmit={add} className="flex flex-wrap items-end gap-3 rounded-4xl glass p-5">
        <label className="text-sm">
          <span className="mb-1 block text-muted">Date *</span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            placeholder="e.g. Diwali"
          />
        </label>
        <button type="submit" disabled={busy} className="btn-primary text-sm disabled:opacity-60">
          {busy ? "Adding…" : "Add holiday"}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-2xl bg-berry/15 px-4 py-2 text-sm text-berry">{error}</p>
      )}

      <div className="mt-5 overflow-hidden rounded-3xl glass">
        {holidays.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            No holidays added. Deliveries already skip Sundays automatically.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {holidays.map((h) => (
              <li key={h.id} className="flex items-center justify-between px-5 py-3">
                <span>
                  <span className="font-medium">{h.date}</span>
                  {h.name ? <span className="text-muted"> · {h.name}</span> : null}
                </span>
                <button
                  onClick={() => remove(h.id)}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-muted transition hover:border-berry/40 hover:text-berry"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
