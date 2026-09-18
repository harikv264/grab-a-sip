import Link from "next/link";
import { SubscriptionForm } from "@/components/admin/SubscriptionForm";

export const dynamic = "force-dynamic";

type Customer = { id: string; name: string; phone: string; locality: string };

async function getCustomers(): Promise<Customer[]> {
  const base = (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
  const token = process.env.ADMIN_API_TOKEN ?? "";
  if (!base || !token) return [];
  try {
    const res = await fetch(`${base}/api/customers?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as Customer[];
  } catch {
    return [];
  }
}

export default async function NewSubscriptionPage({
  searchParams,
}: {
  searchParams: { customerId?: string };
}) {
  const customers = await getCustomers();

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/subscriptions" className="text-sm text-muted hover:text-cream">
          ← Subscriptions
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold">New subscription</h1>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-mango/30 bg-mango/10 px-4 py-3 text-sm text-mango">
          Add a customer first (or the backend is waking up). You need a customer
          before you can start a subscription.
        </div>
      ) : (
        <SubscriptionForm
          mode="create"
          customers={customers}
          initial={{ customerId: searchParams.customerId ?? "" }}
        />
      )}
    </>
  );
}
