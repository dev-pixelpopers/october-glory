"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";

/**
 * Minimal app-wide toast: `showToast()` from anywhere, `<ToastHost />` mounted
 * once in the root layout. Survives client-side navigation, so it works for
 * flows that toast right before a redirect (e.g. guest checkout → login).
 */

type Tone = "success" | "info";
type ToastDetail = { message: string; tone: Tone };

const TOAST_EVENT = "og:toast";
const TOAST_DURATION_MS = 5000;

export function showToast(message: string, tone: Tone = "success") {
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { message, tone } }));
}

export function ToastHost() {
  const [toast, setToast] = useState<ToastDetail | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setToast((e as CustomEvent<ToastDetail>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[120] flex items-center gap-3 bg-[#1e1e1e] border rounded-full pl-4 pr-6 py-3.5 shadow-2xl ${
        toast.tone === "success" ? "border-green-500/40" : "border-[#cba660]/50"
      }`}
    >
      {toast.tone === "success" ? (
        <CheckCircle2 size={20} className="text-green-500" />
      ) : (
        <Info size={20} className="text-[#cba660]" />
      )}
      <p className="gotham text-white text-[15px]">{toast.message}</p>
    </div>
  );
}
