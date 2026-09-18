import { NextResponse } from "next/server";
import { requireAdminUser, backendConfig } from "@/lib/admin-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdminUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const be = backendConfig();
  if (!be) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  const res = await fetch(
    `${be.base}/api/holidays/${params.id}?token=${encodeURIComponent(be.token)}`,
    { method: "DELETE" }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
