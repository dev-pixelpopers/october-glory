"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPanel } from "@/app/components/salon/auth-gate";
import { useMe } from "@/lib/api/hooks/auth";

export default function LoginScreen() {
  const { data: me } = useMe();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Set when guest checkout finds a registered account and reroutes here.
  const prefillEmail = searchParams.get("email") ?? undefined;
  // Callback appended by the proxy when an auth-only page was requested
  // (e.g. /login?redirect=/dashboard/book from a public "Book Now" button).
  const redirectParam = searchParams.get("redirect");

  // Honor the callback first; otherwise guests head into the booking flow
  // and full sign-ins land on their dashboard.
  useEffect(() => {
    if (!me) return;
    // Internal paths only — never forward to another origin ("//evil.com").
    const callback =
      redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
        ? redirectParam
        : null;
    router.replace(
      callback ?? (me.is_guest || me.session_scope === "guest" ? "/dashboard/book" : "/dashboard"),
    );
  }, [me, router, redirectParam]);

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
          <AuthPanel showGuestOption initialEmail={prefillEmail} />
        </div>
      </div>
    </main>
  );
}
