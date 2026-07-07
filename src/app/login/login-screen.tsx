"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/app/components/salon/auth-gate";
import { useMe } from "@/lib/api/hooks/auth";

export default function LoginScreen() {
  const { data: me } = useMe();
  const router = useRouter();

  // Guests (and scoped guest-sessions) head straight into the booking flow;
  // full sign-ins land on their dashboard.
  useEffect(() => {
    if (!me) return;
    router.replace(me.is_guest || me.session_scope === "guest" ? "/booking" : "/dashboard");
  }, [me, router]);

  return (
    <main className="min-h-screen bg-[#151515] flex flex-col">
      <div className="py-8 flex justify-center">
        <Link href="/" className="w-[180px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="October Glory" className="brightness-0 invert object-contain" />
        </Link>
      </div>
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-[520px] px-6 pb-16">
          <AuthPanel showGuestOption />
        </div>
      </div>
    </main>
  );
}
