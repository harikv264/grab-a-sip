import { redirect } from "next/navigation";
import { fetchMe } from "@/lib/admin-api";
import { userApiJson } from "@/lib/user-api";
import { PortalHeader } from "@/components/portal/PortalHeader";

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

  return (
    <div className="min-h-screen">
      <PortalHeader title="Grab A Sip" subtitle="Your deliveries" />
      <main className="mx-auto max-w-3xl px-5 py-6">
        <h1 className="font-display text-2xl font-bold">Hi there 👋</h1>

        {summary && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-3xl glass p-4 text-center">
              <div className="font-display text-2xl font-bold text-lime">
                {summary.activeSubscriptions}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                Active plans
              </div>
            </div>
            <div className="rounded-3xl glass p-4 text-center">
              <div className="font-display text-2xl font-bold">
                {summary.deliveredThisMonth}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                This month
              </div>
            </div>
            <div className="rounded-3xl glass p-4 text-center">
              <div className="font-display text-base font-bold text-aqua">
                {summary.nextDeliveryDate ?? "—"}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                Next drop
              </div>
            </div>
          </div>
        )}

        <h2 className="mb-3 mt-8 font-display text-lg font-bold">Your subscriptions</h2>
        <div className="space-y-3">
          {(subs ?? []).length === 0 ? (
            <div className="rounded-3xl glass p-6 text-muted">
              No subscriptions yet. Message us on WhatsApp to start one.
            </div>
          ) : (
            (subs ?? []).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-3xl glass p-5">
                <div>
                  <div className="font-semibold">{s.planName}</div>
                  <div className="text-sm text-muted">
                    ₹{s.price.toLocaleString("en-IN")}/mo · pauses used {s.pauseDaysUsed}/5
                  </div>
                </div>
                <StatusPill status={s.status} />
              </div>
            ))
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
