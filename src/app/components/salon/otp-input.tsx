"use client";

import React, { useRef } from "react";

/**
 * Six-slot one-time-code input: auto-advance, backspace navigation, and
 * full-code paste support. Value is the concatenated digit string.
 */
export default function OtpInput({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, 6));
  };

  return (
    <div className="flex justify-center gap-2.5" onPaste={(e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (pasted) {
        onChange(pasted);
        refs.current[Math.min(pasted.length, 5)]?.focus();
      }
    }}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digit}
          aria-label={`Digit ${i + 1}`}
          autoFocus={i === 0}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            setDigit(i, d);
            if (d && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digit && i > 0) {
              refs.current[i - 1]?.focus();
              setDigit(i - 1, "");
            }
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
          }}
          className="w-12 h-14 text-center bg-transparent border border-white/25 rounded-[14px] text-white gotham font-bold text-[24px] focus:border-[#cba660] focus:outline-none transition-colors disabled:opacity-50"
        />
      ))}
    </div>
  );
}
