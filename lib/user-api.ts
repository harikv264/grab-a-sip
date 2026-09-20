import { createSupabaseServer } from "@/lib/supabase-server";

export function apiBase() {
  return (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
}

/** The signed-in user's Supabase access token (JWT), from the session cookie. */
export async function userToken(): Promise<string | null> {
  const supabase = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Call the backend AS the signed-in user (forwarding their JWT). The backend
 * scopes the response to that user's role + owned records. Returns null when
 * there's no session or the API base isn't configured.
 */
export async function userApiFetch(
  path: string,
  init?: RequestInit
): Promise<Response | null> {
  const base = apiBase();
  if (!base) return null;
  const token = await userToken();
  if (!token) return null;
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${base}${path}`, { ...init, headers, cache: "no-store" });
}

/** Convenience: GET JSON from the backend as the current user. */
export async function userApiJson<T>(path: string): Promise<T | null> {
  try {
    const res = await userApiFetch(path);
    if (!res || !res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
