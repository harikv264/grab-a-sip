import { createSupabaseServer } from "@/lib/supabase-server";

/** Returns the signed-in admin user, or null. */
export async function requireAdminUser() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Backend base + admin token, or null if not configured. */
export function backendConfig() {
  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) return null;
  return { base: base.replace(/\/+$/, ""), token };
}
