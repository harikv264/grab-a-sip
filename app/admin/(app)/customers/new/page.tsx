import Link from "next/link";
import { CustomerForm } from "@/components/admin/CustomerForm";

export const dynamic = "force-dynamic";

export default function NewCustomerPage({
  searchParams,
}: {
  searchParams: {
    phone?: string;
    locality?: string;
    pincode?: string;
    leadId?: string;
  };
}) {
  const fromLead = Boolean(searchParams.leadId);
  return (
    <>
      <div className="mb-6">
        <Link href="/admin/customers" className="text-sm text-muted hover:text-cream">
          ← Customers
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold">New customer</h1>
        {fromLead && (
          <p className="mt-1 text-sm text-lime">
            Converting a lead — phone &amp; area prefilled.
          </p>
        )}
      </div>
      <CustomerForm
        mode="create"
        initial={{
          phone: searchParams.phone ?? "",
          locality: searchParams.locality ?? "",
          pincode: searchParams.pincode ?? "",
          convertedFromLeadId: searchParams.leadId,
          source: fromLead ? "lead" : "manual",
        }}
      />
    </>
  );
}
