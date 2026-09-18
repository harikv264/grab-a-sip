"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";

type CustomerOption = { id: string; name: string; phone: string; locality: string };

export type SubscriptionValues = {
  id?: string;
  customerId: string;
  planCode: string;
  startDate: string;
  status: string;
  notes: string;
};

export function SubscriptionForm({
  mode,
  customers,
  customerLabel,
  initial,
}: {
  mode: "create" | "edit";
  customers?: CustomerOption[];
  customerLabel?: string; // shown in edit mode instead of a dropdown
  initial?: Partial<SubscriptionValues>;
}) {
  const router = useRouter();
  const [v, setV] = useState<SubscriptionValues>({
    customerId: initial?.customerId ?? "",
    planCode: initial?.planCode ?? "",
    startDate: initial?.startDate ?? new Date().toISOString().slice(0, 10),
    status: initial?.status ?? "active",
    notes: initial?.notes ?? "",
    id: initial?.id,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof SubscriptionValues, val: string) =>
    setV((p) => ({ ...p, [k]: val }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url =
      mode === "create"
        ? "/api/admin/subscriptions"
        : `/api/admin/subscriptions/${v.id}`;
    try {
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || "Could not save subscription.");
        setSaving(false);
        return;
      }
      router.push("/admin/subscriptions");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none transition focus:border-lime/60";

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      <div className="grid gap-4 rounded-4xl glass p-6">
        {/* Customer */}
        <label className="text-sm">
          <span className="mb-1 block text-muted">Customer *</span>
          {mode === "edit" ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-cream">
              {customerLabel}
            </div>
          ) : (
            <select
              required
              value={v.customerId}
              onChange={(e) => set("customerId", e.target.value)}
              className={field}
            >
              <option value="">Select a customer…</option>
              {(customers ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.phone} · {c.locality}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* Plan */}
        <label className="text-sm">
          <span className="mb-1 block text-muted">Plan *</span>
          <select
            required
            value={v.planCode}
            onChange={(e) => set("planCode", e.target.value)}
            className={field}
          >
            <option value="">Select a plan…</option>
            {PRODUCTS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} — ₹{p.price.toLocaleString("en-IN")}/mo
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-muted">Start date</span>
            <input
              type="date"
              value={v.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className={field}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Status</span>
            <select
              value={v.status}
              onChange={(e) => set("status", e.target.value)}
              className={field}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-1 block text-muted">Notes</span>
          <textarea
            value={v.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={`${field} min-h-[70px]`}
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-berry/15 px-4 py-3 text-sm text-berry">
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving
            ? "Saving…"
            : mode === "create"
            ? "Create subscription"
            : "Save changes"}
        </button>
        <Link href="/admin/subscriptions" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
