import { NextResponse } from "next/server";
import { requireAdminUser, backendConfig } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await requireAdminUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const date = new URL(req.url).searchParams.get("date") ?? "";
  const res = await fetch(
    `${be.base}/api/deliveries/generate?token=${encodeURIComponent(be.token)}&date=${encodeURIComponent(date)}`,
    { method: "POST" }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
