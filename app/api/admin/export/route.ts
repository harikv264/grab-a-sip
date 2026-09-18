import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Session-gated proxy: streams the .xlsx from the Java backend using the
 * server-side admin token, but only for a signed-in admin. The backend token
 * never reaches the browser.
 *   GET /api/admin/export?all=1
 */
export async function GET(req: Request) {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const base = process.env.API_BASE_URL;
  const token = process.env.ADMIN_API_TOKEN;
  if (!base || !token) {
    return new NextResponse("Export not configured", { status: 503 });
  }

  const all = new URL(req.url).searchParams.get("all") === "1" ? "1" : "0";
  const res = await fetch(
    `${base.replace(/\/+$/, "")}/api/leads/export?token=${encodeURIComponent(
      token
    )}&all=${all}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    return new NextResponse("Backend export failed", { status: 502 });
  }

  const buf = await res.arrayBuffer();
  const filename =
    all === "1" ? "grabasip-all-leads.xlsx" : "grabasip-undelivered-areas.xlsx";
  return new NextResponse(buf, {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
