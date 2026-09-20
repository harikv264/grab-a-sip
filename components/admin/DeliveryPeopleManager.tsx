"use client";

import { useState } from "react";
import { InviteLoginButton } from "@/components/admin/InviteLoginButton";

type Person = {
  id: string;
  name: string;
  phone: string | null;
  area: string | null;
  active: boolean;
};

export function DeliveryPeopleManager({ initial }: { initial: Person[] }) {
  const [people, setPeople] = useState<Person[]>(initial);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/delivery-persons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, area, active: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || "Could not add.");
      } else {
        setPeople((p) => [...p, data].sort((a, b) => a.name.localeCompare(b.name)));
        setName("");
        setPhone("");
        setArea("");
      }
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (person: Person) => {
    setPeople((ps) =>
      ps.map((p) => (p.id === person.id ? { ...p, active: !p.active } : p))
    );
    await fetch(`/api/admin/delivery-persons/${person.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ active: !person.active }),
    });
  };

  const field =
    "rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-lime/60";

  return (
    <>
      <form onSubmit={add} className="flex flex-wrap items-end gap-3 rounded-4xl glass p-5">
        <label className="text-sm">
          <span className="mb-1 block text-muted">Name *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted">Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted">Area / zone</span>
          <input value={area} onChange={(e) => setArea(e.target.value)} className={field} />
        </label>
        <button type="submit" disabled={busy} className="btn-primary text-sm disabled:opacity-60">
          {busy ? "Adding…" : "Add person"}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-2xl bg-berry/15 px-4 py-2 text-sm text-berry">{error}</p>
      )}

      <div className="mt-5 overflow-x-auto rounded-3xl glass">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {people.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-muted">
                  No delivery people yet.
                </td>
              </tr>
            ) : (
              people.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted">{p.area || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => toggle(p)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          p.active
                            ? "bg-lime/15 text-lime hover:bg-lime/25"
                            : "bg-white/10 text-muted hover:bg-white/15"
                        }`}
                      >
                        {p.active ? "Active" : "Inactive"}
                      </button>
                      <InviteLoginButton kind="rider" id={p.id} phone={p.phone} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
