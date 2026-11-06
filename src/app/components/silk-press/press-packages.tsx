"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import type { Package } from "@/lib/api/types";

export type { Package as PressPackageData };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** "$200.00" -> "$200". Falls back to the raw string if non-numeric. */
function formatPrice(price?: string | number): string {
  if (price === undefined || price === null) return "";
  const n = typeof price === "number" ? price : parseFloat(String(price));
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : String(price);
}

export interface PressPackagesProps {
  tone?: Tone;
  initialPackages?: Package[];
  heading?: {
    eyebrow?: string;
    heading?: string;
    headingAccent?: string;
  };
}

/**
 * Silk Press Packages section.
 *
 * Dynamically fetches packages from the Laravel backend API matching
 * category=silk-press and kind=packages, with fallback to initial SSR data.
 */
export default function PressPackages({
  tone = "light",
  initialPackages,
  heading,
}: PressPackagesProps) {
  const [packages, setPackages] = useState<Package[]>(initialPackages ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPackages || initialPackages.length === 0);
  const [error, setError] = useState<string | null>(null);

  const scope = useReveal<HTMLElement>([
    packages.length,
    packages.map((p) => p.id).join("|"),
  ]);
  const c = palette[tone];

  const header = {
    eyebrow: heading?.eyebrow ?? "Services & Packages",
    heading: heading?.heading ?? "Choose your",
    headingAccent: heading?.headingAccent ?? "silk press",
  };

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      // If server-provided data already exists, skip client fetch unless empty
      if (initialPackages && initialPackages.length > 0) {
        setPackages(initialPackages);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/packages?category=silk-press&kind=packages`, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load silk press packages (status ${res.status})`);
        }

        const json = await res.json();
        const data: Package[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        if (!cancelled) {
          setPackages(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load silk press packages");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPackages();

    return () => {
      cancelled = true;
    };
  }, [initialPackages]);

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-x-clip`}
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mx-auto mb-[var(--space-64)] max-w-[760px] text-center">
          {header.eyebrow && (
            <p
              data-reveal
              className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] uppercase tracking-[6px] mb-[var(--space-20)]`}
            >
              {header.eyebrow}
            </p>
          )}
          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {header.heading}
            {header.headingAccent && (
              <span className="andrea text-[#ccb884]"> {header.headingAccent}</span>
            )}
          </h2>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 items-stretch gap-[var(--space-32)] md:grid-cols-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`flex flex-col rounded-[20px] border p-[var(--space-40)] ${c.cardBorder} ${c.card} animate-pulse`}
              >
                <div className="w-24 h-4 bg-white/10 rounded mb-4" />
                <div className="w-48 h-8 bg-white/10 rounded mb-4" />
                <div className="w-28 h-6 bg-white/10 rounded mb-6" />
                <div className="space-y-3">
                  <div className="w-full h-4 bg-white/5 rounded" />
                  <div className="w-3/4 h-4 bg-white/5 rounded" />
                  <div className="w-1/2 h-4 bg-white/5 rounded" />
                </div>
                <div className="mt-auto pt-10">
                  <div className="w-full h-12 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="mx-auto max-w-[600px] rounded-[16px] border border-red-500/20 bg-red-500/5 p-[var(--space-32)] text-center">
            <p className="gotham text-[length:var(--fs-body)] text-red-400 mb-2">
              {error}
            </p>
            <p className={`gotham text-[length:var(--fs-small)] ${c.muted}`}>
              Please refresh the page or proceed directly to our booking portal.
            </p>
            <div className="mt-[var(--space-20)]">
              <Link
                href="/dashboard/book?service=silk-press"
                className="inline-block gotham text-[12px] uppercase tracking-[3px] text-[#ccb884] underline"
              >
                Book Appointment &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && packages.length === 0 && (
          <div className="mx-auto max-w-[600px] rounded-[16px] border border-white/10 bg-white/5 p-[var(--space-32)] text-center">
            <p className={`gotham text-[length:var(--fs-body)] ${c.body} mb-2`}>
              No silk press packages currently available.
            </p>
            <p className={`gotham text-[length:var(--fs-small)] ${c.muted}`}>
              Custom silk press sessions can be booked directly with our specialists.
            </p>
            <div className="mt-[var(--space-20)]">
              <Link
                href="/dashboard/book?service=silk-press"
                className="inline-block gotham text-[12px] uppercase tracking-[3px] text-[#ccb884] underline"
              >
                Book Individual Session &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Dynamic Packages Grid */}
        {!isLoading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 items-stretch gap-[var(--space-32)] md:grid-cols-3">
            {packages.map((pack, i) => {
              const badge = pack.is_featured
                ? (pack.tagline && pack.tagline !== pack.description ? pack.tagline : "The Full Reset")
                : undefined;
              const priceDisplay = formatPrice(pack.price);

              return (
                <div
                  key={pack.id || pack.slug || pack.name}
                  data-reveal
                  data-reveal-delay={String(2 + (i % 3))}
                  className={`flex flex-col rounded-[20px] border p-[var(--space-40)] transition-colors duration-500 ${
                    pack.is_featured
                      ? "border-[#ccb884] bg-[#1B1B1B]"
                      : `${c.cardBorder} ${c.card} hover:border-[#ccb884]/50`
                  }`}
                >
                  {badge && (
                    <span className="mb-[var(--space-20)] self-start rounded-[4px] bg-[#ccb884] px-[12px] py-[6px] gotham text-[11px] uppercase tracking-[3px] text-[#1B1B1B] font-medium">
                      {badge}
                    </span>
                  )}

                  <h3
                    className={`valturin text-[length:clamp(20px,17.65px_+_0.99vw,28px)] leading-[1.3] ${
                      pack.is_featured ? "text-[#ccb884]" : c.bodyStrong
                    }`}
                  >
                    {pack.name}
                  </h3>

                  {priceDisplay && (
                    <p
                      className={`valturin text-[length:var(--fs-h3)] mt-[var(--space-16)] ${
                        pack.is_featured ? "text-white" : c.bodyStrong
                      }`}
                    >
                      {priceDisplay}
                    </p>
                  )}

                  {pack.includes && pack.includes.length > 0 && (
                    <ul className="mt-[var(--space-24)] flex flex-col gap-[12px]">
                      {pack.includes.map((item, idx) => (
                        <li
                          key={`${item}-${idx}`}
                          className={`gotham flex gap-[12px] text-[length:var(--fs-body)] leading-[1.7] font-light ${
                            pack.is_featured ? "text-white/75" : c.body
                          }`}
                        >
                          <span aria-hidden="true" className="text-[#ccb884]">
                            ·
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/dashboard/book?package=${encodeURIComponent(pack.slug)}`}
                    className="mt-auto pt-[var(--space-40)]"
                  >
                    <span
                      className={`flex items-center justify-center rounded-[6px] py-[14px] gotham text-[length:var(--fs-small)] uppercase tracking-[3px] transition-colors duration-300 ${
                        pack.is_featured
                          ? "bg-[#ccb884] text-[#1B1B1B] hover:bg-[#d8c89c]"
                          : `border ${c.cardBorder} ${c.bodyStrong} hover:border-[#ccb884] hover:text-[#ccb884]`
                      }`}
                    >
                      Book Package
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
