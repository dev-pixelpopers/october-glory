"use client";

import React from "react";
import { useCategories, useServices } from "@/lib/api/hooks/catalog";
import type { Service } from "@/lib/api/types";
import { durationLabel, money } from "@/lib/format";

interface Props {
  selected: Service[];
  onToggle: (service: Service) => void;
}

export default function StepServices({ selected, onToggle }: Props) {
  const { data: categories } = useCategories();
  const { data: services, isLoading, error } = useServices();

  if (isLoading) {
    return <p className="gotham text-white/60 text-center text-[18px] py-20">Loading services…</p>;
  }
  if (error) {
    return (
      <p className="gotham text-red-400 text-center text-[18px] py-20">
        Could not load services — {error.message}
      </p>
    );
  }

  const selectedIds = new Set(selected.map((s) => s.id));
  const grouped = new Map<string, Service[]>();
  for (const service of services ?? []) {
    if (!service.is_active) continue;
    const key = service.category?.name ?? "More Services";
    grouped.set(key, [...(grouped.get(key) ?? []), service]);
  }
  // Preserve admin-defined category order where possible.
  const order = (categories ?? []).map((c) => c.name);
  const sections = [...grouped.entries()].sort(
    (a, b) => (order.indexOf(a[0]) + 1 || 999) - (order.indexOf(b[0]) + 1 || 999),
  );

  return (
    <div>
      <h2 className="andrea text-white text-[64px] text-center leading-none">
        Choose Your Services
      </h2>
      <p className="valturin text-[#cda873] text-[30px] text-center mt-2 mb-12">
        Select one or more — we&apos;ll handle the rest.
      </p>

      {sections.map(([category, items]) => (
        <section key={category} className="mb-12">
          <h3 className="gotham font-bold text-[#cba660] text-[15px] uppercase tracking-[0.25em] mb-5">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((service) => {
              const isSelected = selectedIds.has(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => onToggle(service)}
                  className={`text-left rounded-[22px] border px-7 py-6 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-[#cba660] bg-[#cba660]/10"
                      : "border-white/15 bg-[#1d1d1d] hover:border-white/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="gotham font-bold text-white text-[19px]">{service.name}</h4>
                      {service.description && (
                        <p className="gotham font-light text-white/60 text-[15px] mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                      <p className="gotham text-white/50 text-[14px] mt-3">
                        {durationLabel(service.duration_minutes)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="gotham font-bold text-[#cda873] text-[20px]">
                        {money(service.current_price)}
                      </span>
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full border text-[15px] transition-colors ${
                          isSelected
                            ? "bg-[#cba660] border-[#cba660] text-black"
                            : "border-white/30 text-white/40"
                        }`}
                      >
                        {isSelected ? "✓" : "+"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
