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

  // Role gate: /admin is admin-only. When the backend is reachable and this
  // user isn't an admin (a rider/customer, or an unprovisioned account), deny.
  // `me === null` means we couldn't reach the backend — stay lenient there so a
  // cold start never locks the owner out (data is still API-protected anyway).
  const me = await fetchMe();
  if (me && me.role !== "admin") {
    redirect("/admin/no-access");
  }

  return (
    <div className="min-h-screen">
      <AdminHeader email={user.email ?? ""} role={me?.role ?? null} />
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
