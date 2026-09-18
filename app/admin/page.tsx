import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  createdAt: string | null;
  rawLocation: string | null;
  pincode: string | null;
  matchedArea: string | null;
  serviceable: boolean;
  phone: string | null;
};

type LoadResult = { ok: boolean; leads: Lead[]; reason?: string };

async function getLeads(): Promise<LoadResult> {
  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) return { ok: false, leads: [], reason: "not_configured" };
  try {
    const res = await fetch(
      `${base.replace(/\/+$/, "")}/api/leads?token=${encodeURIComponent(
        token
      )}&all=1`,
      { cache: "no-store" }
    );
    if (!res.ok) return { ok: false, leads: [], reason: `backend ${res.status}` };
    return { ok: true, leads: (await res.json()) as Lead[] };
  } catch {
    return { ok: false, leads: [], reason: "unreachable" };
  }
}

function demandKey(l: Lead): string {
  const raw = (l.pincode || l.rawLocation || "unknown").trim().toLowerCase();
  return raw.replace(/\s+/g, " ");
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AdminDashboard() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { ok, leads, reason } = await getLeads();

  const undelivered = leads.filter((l) => !l.serviceable);
  const serviceable = leads.filter((l) => l.serviceable);

  // Rank undelivered areas by demand.
  const demandMap = new Map<string, { label: string; count: number; phones: number }>();
  for (const l of undelivered) {
    const key = demandKey(l);
    const label = l.pincode || l.rawLocation || "Unknown";
    const cur = demandMap.get(key) ?? { label, count: 0, phones: 0 };
    cur.count += 1;
    if (l.phone) cur.phones += 1;
    demandMap.set(key, cur);
  }
  const demand = Array.from(demandMap.values()).sort(
    (a, b) => b.count - a.count
  );

  const recent = Array.from(leads)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 100);

  const stats = [
    { n: leads.length, l: "Total checks" },
    { n: serviceable.length, l: "In our areas", c: "text-lime" },
    { n: undelivered.length, l: "Coming-soon requests", c: "text-berry" },
    { n: demand.length, l: "Distinct areas wanted", c: "text-aqua" },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader email={user.email ?? ""} />

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Leads &amp; demand</h1>
            <p className="mt-1 text-muted">
              Every serviceability check, and where people want us next.
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/api/admin/export" className="btn-ghost text-sm">
              Export undelivered (.xlsx)
            </a>
            <a href="/api/admin/export?all=1" className="btn-primary text-sm">
              Export all (.xlsx)
            </a>
          </div>
        </div>

        {!ok && (
          <div className="mt-6 rounded-2xl border border-mango/30 bg-mango/10 px-4 py-3 text-sm text-mango">
            Couldn&apos;t load leads from the backend ({reason}). Check{" "}
            <span className="mono">API_BASE_URL</span> and{" "}
            <span className="mono">ADMIN_API_TOKEN</span>. If the backend was
            idle it may be waking up — refresh in a few seconds.
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-3xl glass p-5">
              <div
                className={`font-display text-3xl font-bold ${s.c ?? "text-cream"}`}
              >
                {s.n}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Demand ranking */}
          <section>
            <h2 className="font-display text-xl font-bold">
              Where to expand next
            </h2>
            <p className="mt-1 text-sm text-muted">
              Undelivered areas ranked by how many people asked.
            </p>
            <div className="mt-4 overflow-hidden rounded-3xl glass">
              {demand.length === 0 ? (
                <p className="p-6 text-sm text-muted">
                  No coming-soon requests yet.
                </p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {demand.slice(0, 25).map((d, i) => (
                    <li
                      key={d.label + i}
                      className="flex items-center justify-between gap-3 px-5 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-right font-mono text-sm text-dim">
                          {i + 1}
                        </span>
                        <span className="font-medium capitalize">{d.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        {d.phones > 0 && (
                          <span className="text-muted">📞 {d.phones}</span>
                        )}
                        <span className="rounded-full bg-berry/15 px-2.5 py-0.5 font-semibold text-berry">
                          {d.count}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Recent leads */}
          <section>
            <h2 className="font-display text-xl font-bold">Recent checks</h2>
            <p className="mt-1 text-sm text-muted">Latest 100 lookups.</p>
            <div className="mt-4 overflow-x-auto rounded-3xl glass">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
                    <th className="px-4 py-3 font-medium">When</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Result</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-muted">
                        No checks recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recent.map((l) => (
                      <tr key={l.id} className="border-b border-white/5">
                        <td className="whitespace-nowrap px-4 py-3 text-muted">
                          {fmtDate(l.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          {l.matchedArea || l.pincode || l.rawLocation || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {l.serviceable ? (
                            <span className="rounded-full bg-lime/15 px-2.5 py-0.5 text-xs font-semibold text-lime">
                              Serviceable
                            </span>
                          ) : (
                            <span className="rounded-full bg-berry/15 px-2.5 py-0.5 text-xs font-semibold text-berry">
                              Coming soon
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">
                          {l.phone || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
