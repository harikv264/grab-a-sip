import { redirect } from "next/navigation";
import { fetchMe } from "@/lib/admin-api";
import { userApiJson } from "@/lib/user-api";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { RiderDeliveryList } from "@/components/portal/RiderDeliveryList";
import { JuiceGlass } from "@/components/JuiceGlass";

export const dynamic = "force-dynamic";

type Delivery = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  addressText: string | null;
  planName: string | null;
  status: string;
};
type Stats = {
  deliveredToday: number;
  deliveredThisWeek: number;
  deliveredThisMonth: number;
  failedThisMonth: number;
};

export default async function RiderPortal() {
  const me = await fetchMe();
  if (!me) redirect("/app/login");
  if (me.role !== "rider") redirect("/app/no-access");

  const [deliveries, stats] = await Promise.all([
    userApiJson<Delivery[]>("/api/rider/deliveries"),
    userApiJson<Stats>("/api/rider/stats"),
  ]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const route = deliveries ?? [];
  const routeDone = route.filter((d) => d.status === "delivered").length;
  const routeTotal = route.length;
  const routePct = routeTotal > 0 ? Math.round((routeDone / routeTotal) * 100) : 0;

  return (
    <div className="min-h-screen">
      <PortalHeader title="Rider" subtitle="Your deliveries" />
      <main className="mx-auto max-w-3xl px-5 py-6">
        <h1 className="font-display text-2xl font-bold">Today · {today}</h1>

        {/* Route-progress glass */}
        <div className="mt-4 flex items-center gap-5 rounded-4xl glass p-6">
          <JuiceGlass pct={routePct} color="#C6FF4F" garnishColor="#38F5C9" size={120} showPct />
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-widest text-muted">
              Today&apos;s route
            </div>
            <div className="mt-1 font-display text-3xl font-bold">
              {routeDone}
              <span className="text-muted"> / {routeTotal} done</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              {routeTotal === 0
                ? "No stops assigned yet today."
                : routePct >= 100
                ? "Route complete — glass full! 🎉"
                : "Your glass fills with every drop you complete. Keep it flowing."}
            </p>
          </div>
        </div>

        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { n: stats.deliveredToday, l: "Today", c: "text-lime" },
              { n: stats.deliveredThisWeek, l: "This week" },
              { n: stats.deliveredThisMonth, l: "This month" },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl glass p-4 text-center">
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

        <h2 className="mb-3 mt-8 font-display text-lg font-bold">Your route</h2>
        <RiderDeliveryList initial={deliveries ?? []} />
      </main>
    </div>
  );
}
