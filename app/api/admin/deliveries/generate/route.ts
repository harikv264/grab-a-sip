import { NextResponse } from "next/server";
import { isAdmin, backendConfig } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
