import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadBody = {
  rawLocation?: string;
  pincode?: string;
  matchedArea?: string;
  serviceable?: boolean;
  phone?: string;
};

/**
 * Records a serviceability check as a lead.
 * - If API_BASE_URL (the Spring Boot backend) is set, forwards there server-side
 *   (no CORS, backend URL never exposed to the browser).
 * - Otherwise falls back to a Supabase insert, or a safe no-op if neither is set.
 */
export async function POST(req: Request) {
  let body: LeadBody | null = null;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  // Preferred path: forward to the Java backend, which owns persistence.
  const apiBase = process.env.API_BASE_URL;
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase.replace(/\/+$/, "")}/api/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return NextResponse.json(
        { ok: res.ok, stored: res.ok, via: "api" },
        { status: res.ok ? 200 : 502 }
      );
    } catch {
      return NextResponse.json(
        { ok: false, error: "backend unreachable" },
        { status: 502 }
      );
    }
  }

  // Fallback path: light validation / normalisation for a direct Supabase write.
  const pincode =
    typeof body.pincode === "string" && /^\d{6}$/.test(body.pincode)
      ? body.pincode
      : null;
  const phone =
    typeof body.phone === "string" && body.phone.replace(/\D/g, "").length >= 8
      ? body.phone.trim().slice(0, 20)
      : null;
  const rawLocation =
    typeof body.rawLocation === "string" ? body.rawLocation.trim().slice(0, 200) : null;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Supabase not connected yet — accept but don't persist.
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("leads").insert({
    raw_location: rawLocation,
    pincode,
    matched_area: body.matchedArea ?? null,
    is_serviceable: Boolean(body.serviceable),
    phone,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
