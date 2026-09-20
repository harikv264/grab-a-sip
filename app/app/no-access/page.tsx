"use client";

import { useRouter } from "next/navigation";

export default function AppNoAccessPage() {
  const router = useRouter();
  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/app/login");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-mango/15 text-2xl">
          ⏳
        </div>
        <h1 className="font-display text-2xl font-bold">Account not set up yet</h1>
        <p className="mt-2 text-muted">
          Your login isn&apos;t linked to a rider or customer profile yet. Please
          contact Grab A Sip on WhatsApp and we&apos;ll sort it out.
        </p>
        <button onClick={signOut} className="btn-ghost mt-6">
          Sign out
        </button>
      </div>
    </div>
  );
}
