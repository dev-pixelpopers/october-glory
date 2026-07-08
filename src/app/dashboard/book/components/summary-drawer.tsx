"use client";

import React from "react";
import type { AvailabilitySlot } from "@/lib/api/types";
import { durationLabel, money, timeLabel, shortDate } from "@/lib/format";

interface Props {
  count: number;
  subtotal: number;
  totalDuration: number;
  slot: AvailabilitySlot | null;
  workerName: string | null;
  canContinue: boolean;
  onBack?: () => void;
  onContinue: () => void;
}

export default function SummaryDrawer({
  count,
  subtotal,
  totalDuration,
  slot,
  workerName,
  canContinue,
  onBack,
  onContinue,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      <div className="max-w-[1100px] mx-auto px-6 pb-6">
        <div className="bg-[#1d1d1d] border border-[#cba660]/30 rounded-[30px] shadow-[0_-1vh_4vh_rgba(0,0,0,0.5)] px-8 py-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-baseline gap-3">
            <span className="andrea text-[#cda873] text-[34px] leading-none">{count}</span>
            <span className="gotham text-white/70 text-[15px]">
              service{count === 1 ? "" : "s"}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/15 hidden md:block" />

          <div className="flex flex-col">
            <span className="gotham text-white/50 text-[12px] uppercase tracking-widest">
              Subtotal
            </span>
            <span className="gotham font-bold text-white text-[20px]">{money(subtotal)}</span>
          </div>

          <div className="flex flex-col">
            <span className="gotham text-white/50 text-[12px] uppercase tracking-widest">
              Duration
            </span>
            <span className="gotham font-bold text-white text-[20px]">
              {durationLabel(totalDuration)}
            </span>
          </div>

          {workerName && (
            <div className="flex flex-col">
              <span className="gotham text-white/50 text-[12px] uppercase tracking-widest">
                Specialist
              </span>
              <span className="gotham font-bold text-white text-[20px]">{workerName}</span>
            </div>
          )}

          {slot && (
            <div className="flex flex-col">
              <span className="gotham text-white/50 text-[12px] uppercase tracking-widest">
                Time
              </span>
              <span className="gotham font-bold text-white text-[20px]">
                {shortDate(slot.start)} · {timeLabel(slot.start)}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="gotham text-white/60 hover:text-white text-[16px] px-5 py-3 rounded-full border border-white/25 hover:border-white/60 transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={onContinue}
              disabled={!canContinue}
              className="flex items-center gap-3 bg-[#cba660] hover:bg-[#b8934e] disabled:opacity-40 disabled:cursor-not-allowed text-black gotham font-bold text-[17px] px-8 py-3 rounded-full transition-colors cursor-pointer"
            >
              Continue
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
