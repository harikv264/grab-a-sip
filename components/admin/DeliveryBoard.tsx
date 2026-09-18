"use client";

import { useState } from "react";

type Delivery = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  addressText: string | null;
  planName: string | null;
  status: string;
  deliveryPersonId: string | null;
  notes: string | null;
};
type Person = { id: string; name: string };

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-white/10 text-muted",
  dispatched: "bg-mango/15 text-mango",
  delivered: "bg-lime/15 text-lime",
  failed: "bg-berry/15 text-berry",
};

export function DeliveryBoard({
  initial,
  persons,
}: {
  initial: Delivery[];
  persons: Person[];
}) {
  const [rows, setRows] = useState<Delivery[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const save = async (row: Delivery, patch: Partial<Delivery>) => {
    const next = { ...row, ...patch };
    setBusy(row.id);
    setRows((rs) => rs.map((r) => (r.id === row.id ? next : r)));
    try {
      await fetch(`/api/admin/deliveries/${row.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          status: next.status,
          deliveryPersonId: next.deliveryPersonId,
          notes: next.notes,
        }),
      });
    } finally {
      setBusy(null);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="mt-6 rounded-3xl glass p-8 text-center text-muted">
        No deliveries for this day yet. Use{" "}
        <span className="text-cream">Generate deliveries</span> to create them
        from active subscriptions.
      </div>
    );
  }

  const select =
    "rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-sm text-cream outline-none focus:border-lime/60";

  return (
    <div className="mt-6 overflow-x-auto rounded-3xl glass">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Address</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Rider</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`border-b border-white/5 ${busy === r.id ? "opacity-60" : ""}`}>
              <td className="px-4 py-3">
                <div className="font-medium">{r.customerName}</div>
                <div className="text-xs text-muted">{r.customerPhone}</div>
              </td>
              <td className="max-w-xs px-4 py-3 text-muted">{r.addressText || "—"}</td>
              <td className="whitespace-nowrap px-4 py-3">{r.planName}</td>
              <td className="px-4 py-3">
                <select
                  className={select}
                  value={r.deliveryPersonId ?? ""}
                  onChange={(e) =>
                    save(r, { deliveryPersonId: e.target.value || null })
                  }
                >
                  <option value="">Unassigned</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <select
                  className={`${select} font-semibold ${STATUS_STYLE[r.status] ?? ""}`}
                  value={r.status}
                  onChange={(e) => save(r, { status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
