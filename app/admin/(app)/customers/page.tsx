import Link from "next/link";

export const dynamic = "force-dynamic";

type Customer = {
  id: string;
  name: string;
  phone: string;
  locality: string;
  pincode: string | null;
  addressStatus: string;
  source: string;
  createdAt: string | null;
};

async function getCustomers(q: string): Promise<{ ok: boolean; rows: Customer[]; reason?: string }> {
  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) return { ok: false, rows: [], reason: "not_configured" };
  try {
    const url =
      `${base.replace(/\/+$/, "")}/api/customers?token=${encodeURIComponent(token)}` +
      (q ? `&q=${encodeURIComponent(q)}` : "");
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ok: false, rows: [], reason: `backend ${res.status}` };
    return { ok: true, rows: (await res.json()) as Customer[] };
  } catch {
    return { ok: false, rows: [], reason: "unreachable" };
  }
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const { ok, rows, reason } = await getCustomers(q);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Customers</h1>
          <p className="mt-1 text-muted">
            {rows.length} {rows.length === 1 ? "customer" : "customers"}
            {q ? ` matching “${q}”` : ""}.
          </p>
        </div>
        <Link href="/admin/customers/new" className="btn-primary text-sm">
          + Add customer
        </Link>
      </div>

      {/* Search */}
      <form className="mt-6" action="/admin/customers" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, phone or locality…"
          className="w-full max-w-md rounded-full border border-white/15 bg-white/5 px-5 py-3 text-cream placeholder:text-muted/70 outline-none transition focus:border-lime/60"
        />
      </form>

      {!ok && (
        <div className="mt-6 rounded-2xl border border-mango/30 bg-mango/10 px-4 py-3 text-sm text-mango">
          Couldn&apos;t load customers ({reason}). If the backend was idle it may
          be waking up — refresh in a few seconds.
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-3xl glass">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Locality</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-muted">
                  {q ? "No matches." : "No customers yet. Add your first one."}
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3">
                    {c.locality}
                    {c.pincode ? (
                      <span className="text-muted"> · {c.pincode}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {c.addressStatus === "verified" ? (
                      <span className="rounded-full bg-lime/15 px-2.5 py-0.5 text-xs font-semibold text-lime">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-mango/15 px-2.5 py-0.5 text-xs font-semibold text-mango">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">{c.source}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-cream transition hover:bg-white/5"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
