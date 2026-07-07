"use client";

import React, { useState } from "react";
import { AuthPanel } from "@/app/components/salon/auth-gate";
import { useGuestSession, useMe } from "@/lib/api/hooks/auth";
import { getToken } from "@/lib/api/client";

/**
 * Checkout authentication: signed-in users pass straight through; everyone
 * else chooses "Continue as Guest" (name/email/phone, instant — no OTP) or
 * full sign-in.
 *
 * If the email belongs to a full registered account, the backend denies the
 * guest session (409 USER_REQUIRES_PASSWORD) and useGuestSession reroutes to
 * /login with the email pre-filled so the owner can sign in properly.
 */
export default function CheckoutGate({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useMe();
  const [tab, setTab] = useState<"guest" | "signin">("guest");

  if (getToken() && isLoading) {
    return <p className="gotham text-white/60 text-center text-[17px] py-16">Loading…</p>;
  }

  if (me) return <>{children}</>;

  return (
    <div className="max-w-[520px] mx-auto py-8">
      <div className="flex justify-center gap-2 mb-10">
        {(
          [
            { id: "guest", label: "Continue as Guest" },
            { id: "signin", label: "Sign In / Register" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`gotham text-[15px] px-6 py-3 rounded-full border transition-colors cursor-pointer ${
              tab === t.id
                ? "bg-[#cba660] border-[#cba660] text-black font-bold"
                : "border-white/25 text-white/60 hover:text-white hover:border-white/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "guest" ? <GuestForm /> : <AuthPanel />}
    </div>
  );
}

function GuestForm() {
  const guestSession = useGuestSession();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const field =
    "w-full bg-transparent border border-white/25 rounded-full px-6 py-4 text-white gotham text-[17px] placeholder:text-white/40 focus:border-[#cba660] focus:outline-none transition-colors";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Immediate session — the gate re-renders into checkout on success.
        guestSession.mutate(form);
      }}
      className="flex flex-col gap-4"
    >
      <p className="gotham text-white/60 text-[15px] text-center leading-relaxed mb-2">
        No password, no verification code — just tell us where to send your confirmation.
      </p>
      <input className={field} placeholder="Full Name" value={form.name} required
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className={field} type="email" placeholder="Email Address" value={form.email} required
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className={field} placeholder="Phone (optional)" value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      {guestSession.error && (
        <p className="gotham text-red-400 text-[15px] text-center">{guestSession.error.message}</p>
      )}
      <button
        type="submit"
        disabled={guestSession.isPending}
        className="mt-2 bg-[#cba660] hover:bg-[#b8934e] disabled:opacity-50 text-black gotham font-bold text-[18px] rounded-full py-4 transition-colors cursor-pointer"
      >
        {guestSession.isPending ? "One moment…" : "Continue as Guest"}
      </button>
    </form>
  );
}
