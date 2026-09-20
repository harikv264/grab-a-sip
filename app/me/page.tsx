import { redirect } from "next/navigation";
import { fetchMe } from "@/lib/admin-api";
import { userApiJson } from "@/lib/user-api";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { JuiceGlass } from "@/components/JuiceGlass";
import { planColors, MONTHLY_BOXES } from "@/lib/data";

export const dynamic = "force-dynamic";

type Sub = {
  id: string;
  planName: string;
  price: number;
  status: string;
  startDate: string | null;
  pauseDaysUsed: number;
};
type Delivery = {
  id: string;
  date: string;
  status: string;
  planName: string | null;
};
type Summary = {
  activeSubscriptions: number;
  deliveredThisMonth: number;
  nextDeliveryDate: string | null;
};

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-lime/15 text-lime",
    paused: "bg-mango/15 text-mango",
    cancelled: "bg-white/10 text-muted",
    delivered: "bg-lime/15 text-lime",
    pending: "bg-white/10 text-muted",
    dispatched: "bg-mango/15 text-mango",
    failed: "bg-berry/15 text-berry",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-white/10 text-muted"}`}>
      {status}
    </span>
  );
}

export default async function CustomerPortal() {
  const me = await fetchMe();
  if (!me) redirect("/app/login");
  if (me.role !== "customer") redirect("/app/no-access");

  const [summary, subs, deliveries] = await Promise.all([
    userApiJson<Summary>("/api/customer/summary"),
    userApiJson<Sub[]>("/api/customer/subscriptions"),
    userApiJson<Delivery[]>("/api/customer/deliveries"),
  ]);

  const upcoming = (deliveries ?? []).filter(
    (d) => d.status === "pending" || d.status === "dispatched"
  );
  const recent = (deliveries ?? [])
    .filter((d) => d.status === "delivered" || d.status === "failed")
    .slice(0, 8);

  const delivered = summary?.deliveredThisMonth ?? 0;
  const monthPct = Math.min(100, Math.round((delivered / MONTHLY_BOXES) * 100));
  const activeSubs = (subs ?? []).filter((s) => s.status === "active");
  const heroColors = planColors(activeSubs[0]?.planName ?? subs?.[0]?.planName);

  return (
    <div className="min-h-screen">
      <PortalHeader title="Grab A Sip" subtitle="Your deliveries" />
      <main className="mx-auto max-w-3xl px-5 py-6">
        <h1 className="font-display text-2xl font-bold">Hi there 👋</h1>

        {/* Hero: this month's glass filling up */}
        <div className="mt-4 overflow-hidden rounded-4xl glass">
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
            <JuiceGlass
              pct={monthPct}
              color={heroColors.fill}
              garnishColor={heroColors.garnish}
              size={150}
              showPct
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="text-[11px] uppercase tracking-widest text-muted">
                Your month, filling up
              </div>
              <div className="mt-1 font-display text-3xl font-bold">
                {delivered}
                <span className="text-muted"> / {MONTHLY_BOXES} boxes</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {monthPct >= 100
                  ? "Full glass! You've had a complete month of freshness. 🎉"
                  : `Every delivery tops up your glass. ${
                      MONTHLY_BOXES - delivered
                    } more sips to a full month.`}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/5 p-3 text-center">
                  <div className="font-display text-xl font-bold text-lime">
                    {summary?.activeSubscriptions ?? 0}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted">
                    Plans
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 p-3 text-center">
                  <div className="font-display text-xl font-bold">{delivered}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted">
                    This month
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 p-3 text-center">
                  <div className="font-display text-sm font-bold text-aqua">
                    {summary?.nextDeliveryDate ?? "—"}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted">
                    Next drop
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-3 mt-8 font-display text-lg font-bold">Your subscriptions</h2>
        <div className="space-y-3">
          {(subs ?? []).length === 0 ? (
            <div className="rounded-3xl glass p-6 text-muted">
              No subscriptions yet. Message us on WhatsApp to start one.
            </div>
          ) : (
            (subs ?? []).map((s) => {
              const c = planColors(s.planName);
              const subPct = s.status === "active" ? monthPct : s.status === "paused" ? monthPct : 0;
              return (
                <div key={s.id} className="flex items-center gap-4 rounded-3xl glass p-5">
                  <JuiceGlass pct={subPct} color={c.fill} garnishColor={c.garnish} size={64} />
                  <div className="flex-1">
                    <div className="font-semibold">{s.planName}</div>
                    <div className="text-sm text-muted">
                      ₹{s.price.toLocaleString("en-IN")}/mo · pauses used {s.pauseDaysUsed}/5
                    </div>
                  </div>
                  <StatusPill status={s.status} />
                </div>
              );
            })
          )}
        </div>

        {upcoming.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 font-display text-lg font-bold">Upcoming</h2>
            <div className="space-y-2">
              {upcoming.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-2xl glass px-5 py-3">
                  <span className="font-medium">{d.date}</span>
                  <StatusPill status={d.status} />
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="mb-3 mt-8 font-display text-lg font-bold">Recent deliveries</h2>
        <div className="space-y-2">
          {recent.length === 0 ? (
            <div className="rounded-3xl glass p-6 text-muted">Nothing yet.</div>
          ) : (
            recent.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-2xl glass px-5 py-3">
                <span className="text-muted">{d.date}</span>
                <StatusPill status={d.status} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
