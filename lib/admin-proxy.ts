import { createSupabaseServer } from "@/lib/supabase-server";
import { fetchMe } from "@/lib/admin-api";

/** Returns the signed-in user (any role), or null. */
export async function requireAdminUser() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * True only when the caller is a signed-in admin. Used by the /api/admin/*
 * routes so a logged-in rider/customer can't call them directly.
 * If the backend is unreachable we deny (fail closed) — admin actions can wait.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await requireAdminUser();
  if (!user) return false;
  const me = await fetchMe();
  return me?.role === "admin";
}

/** Backend base + admin token, or null if not configured. */
export function backendConfig() {
  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) return null;
  return { base: base.replace(/\/+$/, ""), token };
}
