import Link from "next/link";
import { SubscriptionForm } from "@/components/admin/SubscriptionForm";
import { PausePanel } from "@/components/admin/PausePanel";

export const dynamic = "force-dynamic";

type Subscription = {
  id: string;
  customerId: string;
  planCode: string;
  planName: string;
  price: number;
  status: string;
  startDate: string | null;
  pauseDaysUsed: number;
  notes: string | null;
};
type Customer = { id: string; name: string; phone: string; locality: string };
type Pause = {
  id: string;
  startDate: string | null;
  days: number;
  note: string | null;
  createdAt: string | null;
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

export default async function ManageSubscriptionPage({
  params,
}: {
  params: { id: string };
}) {
  const sub = await fetchJson<Subscription>(`/api/subscriptions/${params.id}`);
  const [customer, pauses] = await Promise.all([
    sub ? fetchJson<Customer>(`/api/customers/${sub.customerId}`) : Promise.resolve(null),
    fetchJson<Pause[]>(`/api/subscriptions/${params.id}/pauses`),
  ]);

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/subscriptions" className="text-sm text-muted hover:text-cream">
          ← Subscriptions
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold">
          {sub ? sub.planName : "Subscription"}
        </h1>
        {customer && (
          <p className="mt-1 text-muted">
            {customer.name} · {customer.phone} · {customer.locality}
          </p>
        )}
      </div>

      {!sub ? (
        <div className="rounded-2xl border border-mango/30 bg-mango/10 px-4 py-3 text-sm text-mango">
          Couldn&apos;t load this subscription. It may not exist, or the backend
          is waking up — try again in a few seconds.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <SubscriptionForm
            mode="edit"
            customerLabel={
              customer ? `${customer.name} · ${customer.phone}` : sub.customerId
            }
            initial={{
              id: sub.id,
              customerId: sub.customerId,
              planCode: sub.planCode,
              startDate: sub.startDate ?? "",
              status: sub.status,
              notes: sub.notes ?? "",
            }}
          />
          <PausePanel
            subscriptionId={sub.id}
            pauseDaysUsed={sub.pauseDaysUsed}
            pauses={pauses ?? []}
          />
        </div>
      )}
    </>
  );
}
