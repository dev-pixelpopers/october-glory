"use client";

import React, { useState } from "react";
import { useMe, useSetPassword } from "@/lib/api/hooks/auth";

/**
 * Progressive guest → full account conversion. Shown wherever a passwordless
 * guest lands (confirmation screen, client dashboard profile).
 */
export default function SetPasswordBanner() {
  const { data: me } = useMe();
  const setPassword = useSetPassword();
  const [password, setPasswordValue] = useState("");

  if (!me || me.has_password) return null;

  if (setPassword.isSuccess) {
    return (
      <div className="bg-green-400/10 border border-green-400/30 rounded-[22px] p-6 text-center">
        <p className="gotham font-bold text-green-300 text-[16px]">
          Your account is saved! You can now sign in with your email and password.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#cba660]/10 border border-[#cba660]/40 rounded-[22px] p-7">
      <p className="gotham font-bold text-[#cda873] text-[17px]">
        Save your account for faster booking next time!
      </p>
      <p className="gotham font-light text-white/70 text-[15px] mt-1 leading-relaxed">
        Set a password below and skip the email code on your next visit.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPassword.mutate({ password });
        }}
        className="flex flex-col sm:flex-row gap-3 mt-5"
      >
        <input
          type="password"
          minLength={8}
          required
          placeholder="Choose a password (min. 8 characters)"
          value={password}
          onChange={(e) => setPasswordValue(e.target.value)}
          className="flex-1 bg-transparent border border-white/25 rounded-full px-6 py-3.5 text-white gotham text-[15px] placeholder:text-white/40 focus:border-[#cba660] focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={setPassword.isPending}
          className="bg-[#cba660] hover:bg-[#b8934e] disabled:opacity-50 text-black gotham font-bold text-[15px] px-7 py-3.5 rounded-full transition-colors cursor-pointer"
        >
          {setPassword.isPending ? "Saving…" : "Set Password"}
        </button>
      </form>
      {setPassword.error && (
        <p className="gotham text-red-400 text-[14px] mt-3">{setPassword.error.message}</p>
      )}
    </div>
  );
}
