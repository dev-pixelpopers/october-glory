"use client";

import React from "react";
import { useQualifiedWorkers } from "@/lib/api/hooks/catalog";
import type { Worker } from "@/lib/api/types";

interface Props {
  serviceIds: number[];
  selectedWorker: Worker | null;
  anySpecialist: boolean;
  /** null = "Any Specialist" */
  onSelect: (worker: Worker | null) => void;
}

export default function StepSpecialist({
  serviceIds,
  selectedWorker,
  anySpecialist,
  onSelect,
}: Props) {
  const { data: workers, isLoading, error } = useQualifiedWorkers(serviceIds);

  if (isLoading) {
    return <p className="gotham text-white/60 text-center text-[18px] py-20">Finding specialists…</p>;
  }
  if (error) {
    return (
      <p className="gotham text-red-400 text-center text-[18px] py-20">
        Could not load specialists — {error.message}
      </p>
    );
  }

  const cardBase =
    "text-left rounded-[22px] border p-7 transition-all duration-300 cursor-pointer";

  return (
    <div>
      <h2 className="andrea text-white text-[64px] text-center leading-none">
        Pick Your Specialist
      </h2>
      <p className="valturin text-[#cda873] text-[30px] text-center mt-2 mb-12">
        Only stylists qualified for everything you selected.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Any Specialist — auto-routing */}
        <button
          onClick={() => onSelect(null)}
          className={`${cardBase} ${
            anySpecialist
              ? "border-[#cba660] bg-[#cba660]/10"
              : "border-white/15 bg-[#1d1d1d] hover:border-white/40"
          }`}
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full border border-[#cba660] text-[#cba660] text-[26px] mb-5">
            ✦
          </div>
          <h4 className="gotham font-bold text-white text-[20px]">Any Specialist</h4>
          <p className="gotham font-light text-white/60 text-[15px] mt-2 leading-relaxed">
            We&apos;ll match you with the first available stylist qualified for your services.
          </p>
        </button>

        {(workers ?? []).map((worker) => {
          const isSelected = selectedWorker?.id === worker.id;
          return (
            <button
              key={worker.id}
              onClick={() => onSelect(worker)}
              className={`${cardBase} ${
                isSelected
                  ? "border-[#cba660] bg-[#cba660]/10"
                  : "border-white/15 bg-[#1d1d1d] hover:border-white/40"
              }`}
            >
              {worker.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={worker.avatar_url}
                  alt={worker.name}
                  className="w-16 h-16 rounded-full object-cover mb-5"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-b from-[#9C6D51] to-[#5F3A21] text-white andrea text-[26px] mb-5">
                  {worker.name.charAt(0)}
                </div>
              )}
              <h4 className="gotham font-bold text-white text-[20px]">{worker.name}</h4>
              {worker.rating_average != null && (
                <p className="gotham text-[#cda873] text-[15px] mt-1">
                  ★ {worker.rating_average.toFixed(1)}
                  <span className="text-white/40"> · {worker.reviews_count} reviews</span>
                </p>
              )}
              {worker.profile.bio && (
                <p className="gotham font-light text-white/60 text-[15px] mt-2 leading-relaxed line-clamp-3">
                  {worker.profile.bio}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {(workers ?? []).length === 0 && (
        <p className="gotham text-white/50 text-center text-[17px] mt-10">
          No single specialist covers every selected service — try adjusting your selection, or
          choose “Any Specialist”.
        </p>
      )}
    </div>
  );
}
