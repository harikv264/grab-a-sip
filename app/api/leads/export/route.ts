import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Exports leads as CSV (opens directly in Excel / Google Sheets).
 *   GET /api/leads/export?token=YOUR_ADMIN_TOKEN         -> undelivered areas only
 *   GET /api/leads/export?token=YOUR_ADMIN_TOKEN&all=1   -> every lead
 * Protected by the ADMIN_TOKEN env var (temporary gate until Phase 3 auth).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const wantAll = url.searchParams.get("all") === "1";

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return new NextResponse("Supabase not configured", { status: 503 });
  }

  let query = supabase
    .from("leads")
    .select("created_at, pincode, matched_area, raw_location, is_serviceable, phone")
    .order("created_at", { ascending: false });
  if (!wantAll) query = query.eq("is_serviceable", false);

  const { data, error } = await query;
  if (error) return new NextResponse(error.message, { status: 500 });

  const headers = [
    "created_at",
    "pincode",
    "matched_area",
    "raw_location",
    "is_serviceable",
    "phone",
  ];
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = (data ?? []).map((r) =>
    headers.map((h) => escape((r as Record<string, unknown>)[h])).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");

  const filename = wantAll ? "grabasip-all-leads.csv" : "grabasip-undelivered-areas.csv";
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
