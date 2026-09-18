import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Signs the admin out server-side (clears the session cookies). */
export async function POST() {
  const supabase = createSupabaseServer();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
