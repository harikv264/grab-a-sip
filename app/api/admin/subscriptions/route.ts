import { NextResponse } from "next/server";
import { isAdmin, backendConfig } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const sp = new URL(req.url).searchParams;
  const params = new URLSearchParams({ token: be.token });
  if (sp.get("status")) params.set("status", sp.get("status")!);
  if (sp.get("customerId")) params.set("customerId", sp.get("customerId")!);

  const res = await fetch(`${be.base}/api/subscriptions?${params.toString()}`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${be.base}/api/subscriptions?token=${encodeURIComponent(be.token)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
