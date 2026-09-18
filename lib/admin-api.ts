import { createSupabaseServer } from "@/lib/supabase-server";

export type Me = {
  provisioned: boolean;
  role: string | null;
};

/**
 * Ask the backend "who am I", forwarding the signed-in user's Supabase JWT.
 * Returns null when we can't tell (no session, backend cold/unreachable) — the
 * caller should treat that leniently so a cold backend never locks the owner out.
 */
export async function fetchMe(): Promise<Me | null> {
  const base = (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
  if (!base) return null;
  const supabase = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const jwt = session?.access_token;
  if (!jwt) return null;
  try {
    const res = await fetch(`${base}/api/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { provisioned: Boolean(data.provisioned), role: data.role ?? null };
  } catch {
    return null;
  }
}
