import Link from "next/link";
import { DeliveryPeopleManager } from "@/components/admin/DeliveryPeopleManager";

export const dynamic = "force-dynamic";

type Person = {
  id: string;
  name: string;
  phone: string | null;
  area: string | null;
  active: boolean;
};

async function getPeople(): Promise<Person[]> {
  const base = (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
  const token = process.env.ADMIN_API_TOKEN ?? "";
  if (!base || !token) return [];
  try {
    const res = await fetch(
      `${base}/api/delivery-persons?token=${encodeURIComponent(token)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()) as Person[];
  } catch {
    return [];
  }
}

export default async function DeliveryPeoplePage() {
  const people = await getPeople();
  return (
    <>
      <div className="mb-6">
        <Link href="/admin/deliveries" className="text-sm text-muted hover:text-cream">
          ← Deliveries
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold">Delivery people</h1>
      </div>
      <DeliveryPeopleManager initial={people} />
    </>
  );
}
