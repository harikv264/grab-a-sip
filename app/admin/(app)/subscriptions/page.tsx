import Link from "next/link";
import { JuiceGlass } from "@/components/JuiceGlass";
import { planColors } from "@/lib/data";

export const dynamic = "force-dynamic";

type Subscription = {
  id: string;
  customerId: string;
  planName: string;
  planCode: string;
  price: number;
  status: string;
  startDate: string | null;
  pauseDaysUsed: number;
};
type Customer = { id: string; name: string; phone: string };

const base = () => (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
const token = () => process.env.ADMIN_API_TOKEN ?? "";

async function fetchJson<T>(path: string): Promise<T | null> {
  if (!base() || !token()) return null;
  try {
    const sep = path.includes("?") ? "&" : "?";
    const res = await fetch(`${base()}${path}${sep}token=${encodeURIComponent(token())}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const STATUS_TABS = ["all", "active", "paused", "cancelled"] as const;

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status ?? "all";
  const [subsRaw, customersRaw] = await Promise.all([
    fetchJson<Subscription[]>(
      status && status !== "all"
        ? `/api/subscriptions?status=${encodeURIComponent(status)}`
        : `/api/subscriptions`
    ),
    fetchJson<Customer[]>(`/api/customers`),
  ]);

  const subs = subsRaw ?? [];
  const custMap = new Map((customersRaw ?? []).map((c) => [c.id, c]));
  const ok = subsRaw !== null;

  const activeRevenue = subs
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.price, 0);
  const activeCount = subs.filter((s) => s.status === "active").length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Subscriptions</h1>
          <p className="mt-1 text-muted">
            {activeCount} active · ₹{activeRevenue.toLocaleString("en-IN")}/mo
            recurring revenue
          </p>
        </div>
        <Link href="/admin/subscriptions/new" className="btn-primary text-sm">
          + New subscription
        </Link>
      </div>

      {/* Status filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => {
          const active = status === t;
          const href = t === "all" ? "/admin/subscriptions" : `/admin/subscriptions?status=${t}`;
          return (
            <Link
              key={t}
              href={href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition ${
                active ? "bg-white/10 text-cream" : "text-muted hover:text-cream"
              }`}
            >
              {t}
            </Link>
          );
        })}
      </div>

      {!ok && (
        <div className="mt-6 rounded-2xl border border-mango/30 bg-mango/10 px-4 py-3 text-sm text-mango">
          Couldn&apos;t load subscriptions. If the backend was idle it may be
          waking up — refresh in a few seconds.
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-3xl glass">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Start</th>
              <th className="px-4 py-3 font-medium">Pauses</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-muted">
                  No subscriptions yet.
                </td>
              </tr>
            ) : (
              subs.map((s) => {
                const c = custMap.get(s.customerId);
                const pc = planColors(s.planName);
                const glassPct =
                  s.status === "active" ? 100 : s.status === "paused" ? 50 : 8;
                return (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium">
                      {c ? c.name : "—"}
                      {c && (
                        <span className="block text-xs text-muted">{c.phone}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <JuiceGlass
                          pct={glassPct}
                          color={pc.fill}
                          garnishColor={pc.garnish}
                          size={34}
                        />
                        <span>{s.planName}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      ₹{s.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {s.startDate ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">{s.pauseDaysUsed}/5</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        href={`/admin/subscriptions/${s.id}`}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-cream transition hover:bg-white/5"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-lime/15 text-lime",
    paused: "bg-mango/15 text-mango",
    cancelled: "bg-white/10 text-muted",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        map[status] ?? "bg-white/10 text-muted"
      }`}
    >
      {status}
    </span>
  );
}
