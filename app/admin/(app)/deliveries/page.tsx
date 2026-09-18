import Link from "next/link";
import { DeliveryBoard } from "@/components/admin/DeliveryBoard";
import { GenerateDeliveriesButton } from "@/components/admin/GenerateDeliveriesButton";

export const dynamic = "force-dynamic";

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
type Summary = {
  total: number;
  pending: number;
  dispatched: number;
  delivered: number;
  failed: number;
  monthDelivered: number;
  isDeliveryDay: boolean;
};

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

function todayIST(): string {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  )
    .toISOString()
    .slice(0, 10);
}

export default async function DeliveriesPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date ?? "")
    ? searchParams.date!
    : todayIST();

  const [deliveries, persons, summary] = await Promise.all([
    fetchJson<Delivery[]>(`/api/deliveries?date=${date}`),
    fetchJson<Person[]>(`/api/delivery-persons`),
    fetchJson<Summary>(`/api/deliveries/summary?date=${date}`),
  ]);

  const rows = deliveries ?? [];
  const stats = summary;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Deliveries</h1>
          <p className="mt-1 text-muted">The daily delivery board.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/admin/deliveries/people" className="text-muted hover:text-cream">
            Delivery people
          </Link>
          <Link href="/admin/deliveries/holidays" className="text-muted hover:text-cream">
            Holidays
          </Link>
        </div>
      </div>

      {/* Date picker */}
      <form className="mt-6 flex flex-wrap items-center gap-3" action="/admin/deliveries" method="get">
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-lime/60"
        />
        <button type="submit" className="btn-ghost text-sm">
          Go
        </button>
        <span className="text-sm text-muted">
          {stats && !stats.isDeliveryDay && (
            <span className="text-mango">Not a delivery day (Sunday/holiday)</span>
          )}
        </span>
      </form>

      {/* Stats */}
      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { n: stats.total, l: "Scheduled" },
            { n: stats.pending, l: "Pending", c: "text-muted" },
            { n: stats.dispatched, l: "Dispatched", c: "text-mango" },
            { n: stats.delivered, l: "Delivered", c: "text-lime" },
            { n: stats.failed, l: "Failed", c: "text-berry" },
          ].map((s) => (
            <div key={s.l} className="rounded-3xl glass p-4">
              <div className={`font-display text-2xl font-bold ${s.c ?? "text-cream"}`}>
                {s.n}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <GenerateDeliveriesButton date={date} />
        {stats && (
          <span className="text-sm text-muted">
            {stats.monthDelivered} delivered this month
          </span>
        )}
      </div>

      <DeliveryBoard key={`${date}-${rows.length}`} initial={rows} persons={persons ?? []} />
    </>
  );
}
