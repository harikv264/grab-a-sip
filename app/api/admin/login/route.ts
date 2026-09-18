import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Signs an admin in server-side and sets the session cookies. */
export async function POST(req: Request) {
  let email = "";
  let password = "";
  try {
    ({ email, password } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email and password are required." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
