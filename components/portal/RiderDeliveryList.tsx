"use client";

import { useState } from "react";

type Delivery = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  addressText: string | null;
  planName: string | null;
  status: string;
};

const NEXT: Record<string, { label: string; status: string; cls: string }[]> = {
  pending: [
    { label: "Dispatch", status: "dispatched", cls: "bg-mango/20 text-mango" },
  ],
  dispatched: [
    { label: "Delivered", status: "delivered", cls: "bg-lime text-ink" },
    { label: "Failed", status: "failed", cls: "bg-berry/20 text-berry" },
  ],
  delivered: [],
  failed: [
    { label: "Retry → Dispatch", status: "dispatched", cls: "bg-mango/20 text-mango" },
  ],
};

export function RiderDeliveryList({ initial }: { initial: Delivery[] }) {
  const [rows, setRows] = useState<Delivery[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (row: Delivery, status: string) => {
    setBusy(row.id);
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
    try {
      await fetch(`/api/portal/rider/deliveries/${row.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } finally {
      setBusy(null);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl glass p-8 text-center text-muted">
        No deliveries assigned to you for today. 🎉
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.id} className={`rounded-3xl glass p-5 ${busy === r.id ? "opacity-60" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold">{r.customerName}</div>
              <a href={`tel:${r.customerPhone ?? ""}`} className="text-sm text-lime">
                {r.customerPhone}
              </a>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold capitalize">
              {r.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">{r.addressText || "—"}</p>
          <p className="mt-1 text-xs text-dim">{r.planName}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(NEXT[r.status] ?? []).map((a) => (
              <button
                key={a.status + a.label}
                onClick={() => setStatus(r, a.status)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${a.cls}`}
              >
                {a.label}
              </button>
            ))}
            {r.status === "delivered" && (
              <span className="text-sm font-semibold text-lime">Done ✓</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
