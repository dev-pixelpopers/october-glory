"use client";

import React, { useState } from "react";
import { useCategories, usePackages, useServices } from "@/lib/api/hooks/catalog";
import type { Package, Service } from "@/lib/api/types";
import { durationLabel, money, servicePrice } from "@/lib/format";

interface Props {
  selected: Service[];
  onToggle: (service: Service) => void;
  selectedPackage?: Package | null;
  onSelectPackage?: (pkg: Package | null) => void;
  defaultTab?: "services" | "packages";
}

function collectionTitle(pkg: Package): string {
  if (pkg.category?.name) return pkg.category.name;
  if (pkg.collection === "glorious") return "Glorious Packages";
  if (pkg.collection === "bridal") return "Bridal Packages";
  if (pkg.collection === "maintenance") return "Maintenance Packages";
  if (pkg.collection) {
    return pkg.collection.charAt(0).toUpperCase() + pkg.collection.slice(1) + " Packages";
  }
  return "Curated Packages";
}

export default function StepServices({
  selected,
  onToggle,
  selectedPackage,
  onSelectPackage,
  defaultTab = "services",
}: Props) {
  const [activeTab, setActiveTab] = useState<"services" | "packages">(
    selectedPackage ? "packages" : defaultTab,
  );

  const { data: categories } = useCategories();
  const { data: services, isLoading: loadingServices, error: errorServices } = useServices();
  const { data: packages, isLoading: loadingPackages, error: errorPackages } = usePackages();

  const selectedIds = new Set(selected.map((s) => s.id));

  // Group services by category
  const groupedServices = new Map<string, Service[]>();
  for (const service of services ?? []) {
    if (!service.is_active) continue;
    const key = service.category?.name ?? "More Services";
    groupedServices.set(key, [...(groupedServices.get(key) ?? []), service]);
  }
  const order = (categories ?? []).map((c) => c.name);
  const serviceSections = [...groupedServices.entries()].sort(
    (a, b) => (order.indexOf(a[0]) + 1 || 999) - (order.indexOf(b[0]) + 1 || 999),
  );

  // Group packages by collection/category
  const groupedPackages = new Map<string, Package[]>();
  for (const pkg of packages ?? []) {
    if (!pkg.is_active) continue;
    const title = collectionTitle(pkg);
    groupedPackages.set(title, [...(groupedPackages.get(title) ?? []), pkg]);
  }
  const packageSections = [...groupedPackages.entries()];

  return (
    <div>
      <h2 className="andrea text-white text-[64px] text-center leading-none">
        {activeTab === "services" ? "Choose Your Services" : "Choose Your Package"}
      </h2>
      <p className="valturin text-[#cda873] text-[30px] text-center mt-2 mb-8">
        {activeTab === "services"
          ? "Select one or more individual services — we'll handle the rest."
          : "Curated combinations crafted for complete luxury and care."}
      </p>

      {/* Tab Selector */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1.5 rounded-full bg-[#1d1d1d] border border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`px-7 py-3 rounded-full gotham text-[14px] font-bold transition-all cursor-pointer ${
              activeTab === "services"
                ? "bg-[#cba660] text-black shadow-lg"
                : "text-white/70 hover:text-white"
            }`}
          >
            Individual Services
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`px-7 py-3 rounded-full gotham text-[14px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "packages"
                ? "bg-[#cba660] text-black shadow-lg"
                : "text-white/70 hover:text-white"
            }`}
          >
            Curated Packages
            {packages && packages.length > 0 && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "packages" ? "bg-black/20 text-black" : "bg-white/15 text-[#cda873]"
                }`}
              >
                {packages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Curated Packages View */}
      {activeTab === "packages" && (
        <div>
          {loadingPackages && (
            <p className="gotham text-white/60 text-center text-[18px] py-16">Loading packages…</p>
          )}
          {errorPackages && (
            <p className="gotham text-red-400 text-center text-[18px] py-16">
              Could not load packages — {errorPackages.message}
            </p>
          )}

          {!loadingPackages && packageSections.length === 0 && (
            <p className="gotham text-white/50 text-center text-[16px] py-16">
              No packages currently available. Please select from our individual services.
            </p>
          )}

          {packageSections.map(([groupName, items]) => (
            <section key={groupName} className="mb-14">
              <h3 className="gotham font-bold text-[#cba660] text-[15px] uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                <span>{groupName}</span>
                <span className="h-[1px] flex-1 bg-white/10" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const priceNum = parseFloat(pkg.price || "0");
                  const totalNum = parseFloat(pkg.services_total || "0");
                  const hasSavings = totalNum > priceNum && priceNum > 0;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => onSelectPackage?.(isSelected ? null : pkg)}
                      className={`relative text-left rounded-[22px] border p-7 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "border-[#cba660] bg-[#cba660]/10 shadow-[0_0_30px_rgba(203,166,96,0.15)] ring-1 ring-[#cba660]"
                          : "border-white/15 bg-[#1d1d1d] hover:border-white/40"
                      }`}
                    >
                      {/* Top Header */}
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {pkg.collection && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#cba660]/20 text-[#cda873] text-[11px] font-bold uppercase tracking-wider mb-2">
                                {pkg.collection}
                              </span>
                            )}
                            <h4 className="gotham font-bold text-white text-[22px] leading-snug">
                              {pkg.name}
                            </h4>
                            {pkg.tagline && (
                              <p className="gotham font-medium text-[#cda873] text-[15px] mt-1">
                                {pkg.tagline}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <span className="gotham font-bold text-[#cda873] text-[22px]">
                              {money(priceNum)}
                            </span>
                            {hasSavings && (
                              <span className="gotham text-white/40 text-[13px] line-through">
                                Valued at {money(totalNum)}
                              </span>
                            )}
                            <span className="gotham text-white/50 text-[13px] mt-1">
                              {durationLabel(pkg.duration_minutes)}
                            </span>
                          </div>
                        </div>

                        {pkg.description && (
                          <p className="gotham font-light text-white/60 text-[14px] mt-3 leading-relaxed">
                            {pkg.description}
                          </p>
                        )}

                        {/* Bundled Services */}
                        {pkg.services && pkg.services.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-white/10">
                            <p className="gotham text-white/50 text-[12px] uppercase tracking-wider mb-2 font-medium">
                              Includes {pkg.services.length} bundled services:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {pkg.services.map((svc) => (
                                <span
                                  key={svc.id}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-[12px] gotham"
                                >
                                  {svc.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Includes Bullets fallback */}
                        {(!pkg.services || pkg.services.length === 0) &&
                          pkg.includes &&
                          pkg.includes.length > 0 && (
                            <div className="mt-5 pt-4 border-t border-white/10">
                              <p className="gotham text-white/50 text-[12px] uppercase tracking-wider mb-2 font-medium">
                                Highlights:
                              </p>
                              <ul className="grid grid-cols-1 gap-1 text-[13px] gotham text-white/70">
                                {pkg.includes.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <span className="text-[#cba660]">✦</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>

                      {/* Bottom action */}
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="gotham text-white/50 text-[13px]">
                          {isSelected ? "Package selected" : "Click to select"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPackage?.(isSelected ? null : pkg);
                          }}
                          className={`px-5 py-2 rounded-full gotham text-[14px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cba660] text-black"
                              : "border border-white/30 text-white hover:border-[#cba660] hover:text-[#cba660]"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Select Package"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Individual Services View */}
      {activeTab === "services" && (
        <div>
          {selectedPackage && (
            <div className="bg-[#cba660]/10 border border-[#cba660]/40 rounded-[18px] p-4 mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="gotham text-white text-[15px]">
                  <strong className="text-[#cba660]">Package Active:</strong> {selectedPackage.name}{" "}
                  ({money(selectedPackage.price)})
                </p>
                <p className="gotham text-white/60 text-[13px] mt-0.5">
                  Selecting an individual service will switch your booking to a custom service
                  selection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectPackage?.(null)}
                className="gotham text-[13px] text-white/70 hover:text-white border border-white/30 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
              >
                Clear Package
              </button>
            </div>
          )}

          {loadingServices && (
            <p className="gotham text-white/60 text-center text-[18px] py-20">Loading services…</p>
          )}
          {errorServices && (
            <p className="gotham text-red-400 text-center text-[18px] py-20">
              Could not load services — {errorServices.message}
            </p>
          )}

          {serviceSections.map(([category, items]) => (
            <section key={category} className="mb-12">
              <h3 className="gotham font-bold text-[#cba660] text-[15px] uppercase tracking-[0.25em] mb-5">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((service) => {
                  const isSelected = !selectedPackage && selectedIds.has(service.id);
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
                        {service.image && (
                          <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={service.image} alt="" className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
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
                          <span
                            className={`gotham font-bold text-[#cda873] ${
                              service.price_by_consultation ? "text-[15px]" : "text-[20px]"
                            }`}
                          >
                            {servicePrice(service.current_price, service.price_by_consultation)}
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
      )}
    </div>
  );
}
