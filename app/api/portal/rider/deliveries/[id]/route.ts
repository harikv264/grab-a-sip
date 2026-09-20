import { NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Rider updates one of their own deliveries — forwards their JWT; the backend
 *  enforces that it's actually theirs. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const res = await userApiFetch(`/api/rider/deliveries/${params.id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
