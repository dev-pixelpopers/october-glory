"use client";

import React, { useMemo } from "react";
import { useAvailability } from "@/lib/api/hooks/booking";
import type { AvailabilitySlot } from "@/lib/api/types";
import { durationLabel, timeLabel, toDateKey } from "@/lib/format";

interface Props {
  serviceIds: number[];
  workerId: number | null;
  totalDuration: number;
  date: string | null;
  slot: AvailabilitySlot | null;
  onDateChange: (date: string) => void;
  onSlotSelect: (slot: AvailabilitySlot) => void;
}

/** Salon display window: candidate times every 30 min, 9:00 – 19:00. */
const GRID_START_HOUR = 9;
const GRID_END_HOUR = 19;

export default function StepDateTime({
  serviceIds,
  workerId,
  totalDuration,
  date,
  slot,
  onDateChange,
  onSlotSelect,
}: Props) {
  const days = useMemo(() => {
    const out: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const { data: openSlots, isLoading } = useAvailability(date, serviceIds, workerId);

  // Map open slots by "HH:MM" so the full grid can grey out taken times.
  const openByTime = useMemo(() => {
    const map = new Map<string, AvailabilitySlot>();
    for (const s of openSlots ?? []) {
      const d = new Date(s.start);
      const key = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, s);
    }
    return map;
  }, [openSlots]);

  const gridTimes = useMemo(() => {
    const out: string[] = [];
    for (let h = GRID_START_HOUR; h < GRID_END_HOUR; h++) {
      out.push(`${String(h).padStart(2, "0")}:00`, `${String(h).padStart(2, "0")}:30`);
    }
    return out;
  }, []);

  return (
    <div>
      <h2 className="andrea text-white text-[64px] text-center leading-none">
        Pick Your Moment
      </h2>
      <p className="valturin text-[#cda873] text-[30px] text-center mt-2 mb-12">
        Your session will run {durationLabel(totalDuration)}.
      </p>

      {/* Date strip */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-10">
        {days.map((d) => {
          const key = toDateKey(d);
          const isSelected = date === key;
          return (
            <button
              key={key}
              onClick={() => onDateChange(key)}
              className={`shrink-0 flex flex-col items-center rounded-[18px] border px-5 py-4 transition-colors cursor-pointer ${
                isSelected
                  ? "border-[#cba660] bg-[#cba660]/10"
                  : "border-white/15 bg-[#1d1d1d] hover:border-white/40"
              }`}
            >
              <span className="gotham text-white/50 text-[12px] uppercase tracking-widest">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span
                className={`gotham font-bold text-[24px] ${isSelected ? "text-[#cda873]" : "text-white"}`}
              >
                {d.getDate()}
              </span>
              <span className="gotham text-white/50 text-[12px]">
                {d.toLocaleDateString("en-US", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time grid — open slots are clickable, booked/off-shift times greyed out */}
      {!date && (
        <p className="gotham text-white/50 text-center text-[17px]">Select a date above.</p>
      )}
      {date && isLoading && (
        <p className="gotham text-white/60 text-center text-[17px]">Checking availability…</p>
      )}
      {date && !isLoading && (
        <>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {gridTimes.map((time) => {
              const open = openByTime.get(time);
              const isSelected = !!slot && !!open && slot.start === open.start;
              return (
                <button
                  key={time}
                  disabled={!open}
                  onClick={() => open && onSlotSelect(open)}
                  className={`rounded-full border py-3 gotham text-[16px] transition-colors ${
                    isSelected
                      ? "bg-[#cba660] border-[#cba660] text-black font-bold cursor-pointer"
                      : open
                        ? "border-white/25 text-white hover:border-[#cba660] hover:text-[#cda873] cursor-pointer"
                        : "border-white/10 text-white/25 line-through cursor-not-allowed"
                  }`}
                >
                  {timeLabel(`${date}T${time}:00`)}
                </button>
              );
            })}
          </div>
          {openByTime.size === 0 && (
            <p className="gotham text-white/50 text-center text-[17px] mt-8">
              Fully booked that day — try another date.
            </p>
          )}
          {slot && workerId === null && (
            <p className="gotham text-[#cda873] text-center text-[16px] mt-8">
              You&apos;ll be seen by <span className="font-bold">{slot.worker_name}</span>.
            </p>
          )}
        </>
      )}
    </div>
  );
}
