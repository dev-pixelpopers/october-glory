"use client";

import React, { useEffect, useState } from "react";
import {
  useGuestSession,
  useLogin,
  useMe,
  useRegister,
  useResendOtp,
  useVerifyOtp,
} from "@/lib/api/hooks/auth";
import { ApiError, getToken } from "@/lib/api/client";
import OtpInput from "./otp-input";

/**
 * Renders children only for an authenticated user; otherwise shows an
 * inline login / register panel styled to the October Glory brand.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useMe();

  if (getToken() && isLoading) {
    return (
      <div className="flex justify-center py-24">
        <p className="gotham text-white/60 text-[18px]">Loading…</p>
      </div>
    );
  }

  if (me) return <>{children}</>;

  return (
    <div className="max-w-[520px] mx-auto py-16 px-6">
      <AuthPanel />
    </div>
  );
}

export const authFieldClass =
  "w-full bg-transparent border border-white/25 rounded-full px-6 py-4 text-white gotham text-[17px] placeholder:text-white/40 focus:border-[#cba660] focus:outline-none transition-colors";

const goldButton =
  "mt-2 bg-[#cba660] hover:bg-[#b8934e] disabled:opacity-50 text-black gotham font-bold text-[18px] rounded-full py-4 transition-colors cursor-pointer";

type Mode = "login" | "register" | "guest" | "otp";

/**
 * Modes:
 *  - login:    email/password, plus an "OR — Continue as Guest" option.
 *  - register: full sign-up; success transitions to OTP verification.
 *  - guest:    name + email only → immediate frictionless session → /booking.
 *  - otp:      6-slot code entry with a resend-countdown button.
 */
export function AuthPanel({ showGuestOption = false }: { showGuestOption?: boolean }) {
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [otpCode, setOtpCode] = useState("");
  const [otpInfo, setOtpInfo] = useState("");

  const login = useLogin();
  const register = useRegister();
  const guest = useGuestSession();
  const verifyOtp = useVerifyOtp();

  const pending = login.isPending || register.isPending || guest.isPending || verifyOtp.isPending;

  const enterOtpMode = (message: string) => {
    setOtpInfo(message);
    setOtpCode("");
    setMode("otp");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "otp") {
      verifyOtp.mutate({ email: form.email, otp_code: otpCode });
      return;
    }

    if (mode === "guest") {
      // Session lands in the query cache; the host screen (login page /
      // checkout gate) handles where the guest goes next.
      guest.mutate({ name: form.name, email: form.email });
      return;
    }

    if (mode === "login") {
      login.mutate(
        { email: form.email, password: form.password },
        {
          onError: (err) => {
            // 423: passwordless guest OR unverified registration — a code
            // was just emailed either way.
            if (err instanceof ApiError && err.status === 423) {
              enterOtpMode(err.message);
            }
          },
        },
      );
      return;
    }

    register.mutate(form, {
      onSuccess: (res) => enterOtpMode(res.message),
    });
  };

  const error =
    mode === "otp"
      ? verifyOtp.error
      : mode === "guest"
        ? guest.error
        : ((login.error instanceof ApiError && login.error.status === 423 ? null : login.error) ??
          register.error);

  const heading: Record<Mode, [string, string]> = {
    login: ["Welcome Back", "Sign in to continue."],
    register: ["Join Us", "Create an account to book your visit."],
    guest: ["Book as Guest", "Just your name and email — nothing else."],
    otp: ["Check Your Email", "Enter the 6-digit code we just sent."],
  };

  return (
    <>
      <h2 className="andrea text-white text-[56px] text-center leading-none">{heading[mode][0]}</h2>
      <p className="valturin text-[#cda873] text-[28px] text-center mt-2 mb-10">{heading[mode][1]}</p>

      {mode === "otp" && otpInfo && (
        <p className="gotham text-white/70 text-[15px] text-center mb-6 leading-relaxed">{otpInfo}</p>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4">
        {(mode === "register" || mode === "guest") && (
          <input
            className={authFieldClass}
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        {mode === "register" && (
          <input
            className={authFieldClass}
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        )}

        {mode !== "otp" && (
          <input
            className={authFieldClass}
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        )}

        {(mode === "login" || mode === "register") && (
          <input
            className={authFieldClass}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={mode === "register" ? 8 : 1}
          />
        )}

        {mode === "otp" && (
          <>
            <OtpInput value={otpCode} onChange={setOtpCode} disabled={verifyOtp.isPending} />
            <ResendButton email={form.email} />
          </>
        )}

        {error && <p className="gotham text-red-400 text-[15px] text-center">{error.message}</p>}

        <button
          type="submit"
          disabled={pending || (mode === "otp" && otpCode.length !== 6)}
          className={goldButton}
        >
          {pending
            ? "Please wait…"
            : mode === "login"
              ? "Sign In"
              : mode === "register"
                ? "Create Account"
                : mode === "guest"
                  ? "Continue as Guest"
                  : "Verify & Sign In"}
        </button>
      </form>

      {/* OR divider + guest entry, on the main login view */}
      {mode === "login" && showGuestOption && (
        <>
          <div className="flex items-center gap-4 my-7">
            <span className="flex-1 h-[1px] bg-white/15" />
            <span className="gotham text-white/40 text-[13px] uppercase tracking-[0.3em]">or</span>
            <span className="flex-1 h-[1px] bg-white/15" />
          </div>
          <button
            onClick={() => setMode("guest")}
            className="w-full border border-[#cba660] text-[#cda873] hover:bg-[#cba660]/10 gotham font-bold text-[17px] rounded-full py-4 transition-colors cursor-pointer"
          >
            Continue as Guest
          </button>
        </>
      )}

      {/* Mode switchers */}
      <div className="flex flex-col items-center gap-3 mt-6">
        {(mode === "login" || mode === "register") && (
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="gotham text-white/60 hover:text-[#cba660] text-[16px] transition-colors cursor-pointer"
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        )}
        {(mode === "guest" || mode === "otp") && (
          <button
            onClick={() => setMode("login")}
            className="gotham text-white/60 hover:text-[#cba660] text-[16px] transition-colors cursor-pointer"
          >
            ← Back to sign in
          </button>
        )}
      </div>
    </>
  );
}

function ResendButton({ email }: { email: string }) {
  const resend = useResendOtp();
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <button
      type="button"
      disabled={cooldown > 0 || resend.isPending}
      onClick={() => resend.mutate({ email }, { onSuccess: () => setCooldown(60) })}
      className="gotham text-white/50 hover:text-[#cda873] disabled:hover:text-white/50 disabled:cursor-default text-[14px] transition-colors cursor-pointer mt-1"
    >
      {cooldown > 0 ? `Resend code in ${cooldown}s` : resend.isPending ? "Sending…" : "Resend code"}
    </button>
  );
}
