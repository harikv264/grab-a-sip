"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LOCALITY_OPTIONS } from "@/lib/serviceability";

export type CustomerValues = {
  id?: string;
  name: string;
  phone: string;
  flatHouse: string;
  street: string;
  locality: string;
  pincode: string;
  landmark: string;
  notes: string;
  addressStatus: string;
  source: string;
  convertedFromLeadId?: string;
};

const empty: CustomerValues = {
  name: "",
  phone: "",
  flatHouse: "",
  street: "",
  locality: "",
  pincode: "",
  landmark: "",
  notes: "",
  addressStatus: "pending",
  source: "manual",
};

export function CustomerForm({
  initial,
  mode,
}: {
  initial?: Partial<CustomerValues>;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [v, setV] = useState<CustomerValues>({ ...empty, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof CustomerValues, val: string) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url =
      mode === "create"
        ? "/api/admin/customers"
        : `/api/admin/customers/${v.id}`;
    const method = mode === "create" ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || "Could not save customer.");
        setSaving(false);
        return;
      }
      router.push("/admin/customers");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none transition focus:border-lime/60";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <div className="grid gap-4 rounded-4xl glass p-6 sm:grid-cols-2">
        <label className="text-sm sm:col-span-1">
          <span className="mb-1 block text-muted">Name *</span>
          <input
            required
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            className={field}
          />
        </label>
        <label className="text-sm sm:col-span-1">
          <span className="mb-1 block text-muted">Phone (WhatsApp) *</span>
          <input
            required
            value={v.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={field}
            inputMode="tel"
          />
        </label>

        <label className="text-sm sm:col-span-1">
          <span className="mb-1 block text-muted">Flat / House</span>
          <input
            value={v.flatHouse}
            onChange={(e) => set("flatHouse", e.target.value)}
            className={field}
          />
        </label>
        <label className="text-sm sm:col-span-1">
          <span className="mb-1 block text-muted">Street</span>
          <input
            value={v.street}
            onChange={(e) => set("street", e.target.value)}
            className={field}
          />
        </label>

        <label className="text-sm sm:col-span-1">
          <span className="mb-1 block text-muted">Locality *</span>
          <select
            required
            value={v.locality}
            onChange={(e) => set("locality", e.target.value)}
            className={field}
          >
            <option value="">Select a served area…</option>
            {LOCALITY_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-1">
          <span className="mb-1 block text-muted">Pincode</span>
          <input
            value={v.pincode}
            onChange={(e) => set("pincode", e.target.value)}
            className={field}
            inputMode="numeric"
            placeholder="6 digits"
          />
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-muted">Landmark</span>
          <input
            value={v.landmark}
            onChange={(e) => set("landmark", e.target.value)}
            className={field}
            placeholder="e.g. opposite DLF, near the park"
          />
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-muted">Notes</span>
          <textarea
            value={v.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={`${field} min-h-[70px]`}
          />
        </label>

        {mode === "edit" && (
          <div className="text-sm sm:col-span-2">
            <span className="mb-1 block text-muted">Address status</span>
            <div className="flex gap-2">
              {["pending", "verified"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("addressStatus", s)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                    v.addressStatus === s
                      ? s === "verified"
                        ? "bg-lime text-ink"
                        : "bg-mango/20 text-mango"
                      : "border border-white/15 text-muted hover:text-cream"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-berry/15 px-4 py-3 text-sm text-berry">
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : mode === "create" ? "Add customer" : "Save changes"}
        </button>
        <Link href="/admin/customers" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
