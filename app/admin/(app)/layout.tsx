import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { fetchMe } from "@/lib/admin-api";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Role gate: a provisioned non-admin (rider/customer) can't be here.
  // If we can't resolve the role (backend cold / not provisioned), stay lenient
  // — the API still protects data — so the owner is never locked out.
  const me = await fetchMe();
  if (me?.provisioned && me.role && me.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <AdminHeader email={user.email ?? ""} role={me?.role ?? null} />
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
