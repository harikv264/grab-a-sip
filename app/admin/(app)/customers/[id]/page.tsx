import Link from "next/link";
import { CustomerForm } from "@/components/admin/CustomerForm";

export const dynamic = "force-dynamic";

type Customer = {
  id: string;
  name: string;
  phone: string;
  flatHouse: string | null;
  street: string | null;
  locality: string;
  pincode: string | null;
  landmark: string | null;
  addressStatus: string;
  source: string;
  notes: string | null;
};

async function getCustomer(id: string): Promise<Customer | null> {
  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) return null;
  try {
    const res = await fetch(
      `${base.replace(/\/+$/, "")}/api/customers/${id}?token=${encodeURIComponent(
        token
      )}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return (await res.json()) as Customer;
  } catch {
    return null;
  }
}

export default async function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const c = await getCustomer(params.id);

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/customers" className="text-sm text-muted hover:text-cream">
          ← Customers
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold">
            {c ? c.name : "Customer"}
          </h1>
          {c && (
            <Link
              href={`/admin/subscriptions/new?customerId=${c.id}`}
              className="btn-ghost text-sm"
            >
              + Start a subscription
            </Link>
          )}
        </div>
      </div>

      {!c ? (
        <div className="rounded-2xl border border-mango/30 bg-mango/10 px-4 py-3 text-sm text-mango">
          Couldn&apos;t load this customer. It may not exist, or the backend is
          waking up — try again in a few seconds.
        </div>
      ) : (
        <CustomerForm
          mode="edit"
          initial={{
            id: c.id,
            name: c.name,
            phone: c.phone,
            flatHouse: c.flatHouse ?? "",
            street: c.street ?? "",
            locality: c.locality,
            pincode: c.pincode ?? "",
            landmark: c.landmark ?? "",
            notes: c.notes ?? "",
            addressStatus: c.addressStatus,
            source: c.source,
          }}
        />
      )}
    </>
  );
}
