import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { apiBase } from "@/lib/user-api";
import { toE164 } from "@/lib/phone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Rider/customer login by password. Accepts either a phone (interim, until
 * MSG91 phone-OTP) or an email (used by test accounts and email sign-ups).
 */
export async function POST(req: Request) {
  let phone = "";
  let email = "";
  let password = "";
  try {
    ({ phone = "", email = "", password = "" } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const useEmail = Boolean(email && email.includes("@"));
  const e164 = useEmail ? "" : toE164(phone);
  if ((!useEmail && !e164) || !password) {
    return NextResponse.json(
      { ok: false, error: "Enter your email or phone, and your password." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword(
    useEmail ? { email, password } : { phone: e164 as string, password }
  );
  if (error || !data.session) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Sign in failed." },
      { status: 401 }
    );
  }

  // Resolve role from the backend so the client can route to the right portal.
  let role: string | null = null;
  const base = apiBase();
  if (base) {
    try {
      const r = await fetch(`${base}/api/me`, {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        cache: "no-store",
      });
      if (r.ok) role = (await r.json())?.role ?? null;
    } catch {
      /* ignore — client will fall back to no-access */
    }
  }
  return NextResponse.json({ ok: true, role });
}
