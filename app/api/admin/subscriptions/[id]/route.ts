import { NextResponse } from "next/server";
import { isAdmin, backendConfig } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const res = await fetch(
    `${be.base}/api/subscriptions/${params.id}?token=${encodeURIComponent(be.token)}`,
    { cache: "no-store" }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${be.base}/api/subscriptions/${params.id}?token=${encodeURIComponent(be.token)}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
