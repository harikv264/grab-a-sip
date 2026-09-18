import { NextResponse } from "next/server";
import { requireAdminUser, backendConfig } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdminUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${be.base}/api/delivery-persons/${params.id}?token=${encodeURIComponent(be.token)}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
