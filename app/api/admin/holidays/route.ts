import { NextResponse } from "next/server";
import { requireAdminUser, backendConfig } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdminUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  const res = await fetch(`${be.base}/api/holidays?token=${encodeURIComponent(be.token)}`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  if (!(await requireAdminUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${be.base}/api/holidays?token=${encodeURIComponent(be.token)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
