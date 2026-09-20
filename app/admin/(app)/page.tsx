import Link from "next/link";
import { CountUp } from "@/components/fx/CountUp";
import { Sparkline } from "@/components/fx/Sparkline";

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

  // Build 14-day daily buckets for the KPI sparklines.
  const DAYS = 14;
  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const buckets = new Map<string, { all: number; ok: number; no: number }>();
  const today = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.set(dayKey(d), { all: 0, ok: 0, no: 0 });
  }
  for (const l of leads) {
    if (!l.createdAt) continue;
    const k = l.createdAt.slice(0, 10);
    const b = buckets.get(k);
    if (!b) continue;
    b.all += 1;
    if (l.serviceable) b.ok += 1;
    else b.no += 1;
  }
  const series = Array.from(buckets.values());
  const trendAll = series.map((b) => b.all);
  const trendOk = series.map((b) => b.ok);
  const trendNo = series.map((b) => b.no);

  const maxDemand = Math.max(1, ...demand.map((d) => d.count));

  const stats = [
    { n: leads.length, l: "Total checks", spark: trendAll, color: "#ECEAF6" },
    { n: serviceable.length, l: "In our areas", c: "text-lime", spark: trendOk, color: "#C6FF4F" },
    { n: undelivered.length, l: "Coming-soon requests", c: "text-berry", spark: trendNo, color: "#FF3E9A" },
    { n: demand.length, l: "Distinct areas wanted", c: "text-aqua", spark: null, color: "#38F5C9" },
  ];

  return (
    <>
      <div>
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
            <div key={s.l} className="sheen flex flex-col justify-between rounded-3xl glass p-5">
              <div>
                <div className={`font-display text-3xl font-bold ${s.c ?? "text-cream"}`}>
                  <CountUp value={s.n} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted">
                  {s.l}
                </div>
              </div>
              {s.spark ? (
                <div className="mt-3 -mb-1 flex justify-end">
                  <Sparkline data={s.spark} color={s.color} width={120} height={34} />
                </div>
              ) : (
                <div className="mt-3 text-[11px] text-dim">last 14 days →</div>
              )}
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
                      className="relative flex items-center justify-between gap-3 px-5 py-3"
                    >
                      {/* demand-intensity bar */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 origin-left rounded-r-full bg-gradient-to-r from-berry/25 to-berry/5"
                        style={{ width: `${(d.count / maxDemand) * 100}%` }}
                      />
                      <div className="relative flex items-center gap-3">
                        <span className="w-6 text-right font-mono text-sm text-dim">
                          {i + 1}
                        </span>
                        <span className="font-medium capitalize">{d.label}</span>
                      </div>
                      <div className="relative flex items-center gap-3 text-sm">
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
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-muted">
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
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {l.serviceable && (
                            <Link
                              href={`/admin/customers/new?${new URLSearchParams({
                                ...(l.phone ? { phone: l.phone } : {}),
                                ...(l.matchedArea ? { locality: l.matchedArea } : {}),
                                ...(l.pincode ? { pincode: l.pincode } : {}),
                                leadId: l.id,
                              }).toString()}`}
                              className="rounded-full border border-lime/30 bg-lime/10 px-2.5 py-1 text-xs font-semibold text-lime transition hover:bg-lime/20"
                            >
                              + Customer
                            </Link>
                          )}
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
    </>
  );
}
