"use client";

import React from "react";
import { useReveal } from "./use-reveal";
import type { ComparisonValue, ServiceComparison } from "@/data/services/types";

function Cell({ value }: { value: ComparisonValue }) {
  if (value === false) {
    return (
      <span
        className="text-[#1B1B1B]/25 text-[20px] leading-none"
        aria-label="Not included"
      >
        —
      </span>
    );
  }

  // Text-only cell: neither a check nor a dash, e.g. "Available separately".
  if (typeof value === "object") {
    return (
      <span className="gotham text-[13px] leading-[22px] text-[#777] font-light">
        {value.text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-[#9C6D51]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[18px] h-[18px]"
        aria-label="Included"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {typeof value === "string" && (
        <span className="gotham text-[12px] text-[#888] font-light whitespace-nowrap">
          ({value})
        </span>
      )}
    </span>
  );
}

export default function ServiceComparisonTable({
  comparison,
}: {
  comparison: ServiceComparison;
}) {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      ref={scope}
      className="reveal-scope relative w-full bg-white text-[#1B1B1B] py-[100px] md:py-[140px] px-[24px] md:px-[110px]"
    >
      <div className="text-center mb-[60px] md:mb-[80px]">
        {comparison.eyebrow && (
          <p
            data-reveal
            className="gotham text-[#9C6D51] text-[13px] md:text-[14px] tracking-[6px] uppercase mb-5"
          >
            {comparison.eyebrow}
          </p>
        )}

        <h2
          data-reveal
          data-reveal-delay="1"
          className="andrea text-[44px] md:text-[64px] leading-[1.15] text-[#1B1B1B]"
        >
          {comparison.heading}
        </h2>

        <div
          data-reveal
          data-reveal-delay="2"
          className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-7"
        />
      </div>

      {/* Horizontal scroll keeps four-tier tables usable on narrow screens */}
      <div
        data-reveal
        data-reveal-delay="3"
        className="max-w-[1200px] mx-auto overflow-x-auto rounded-[24px] border border-[#1B1B1B]/10"
      >
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-[#FAF8F4]">
              <th className="text-left gotham text-[12px] tracking-[3px] uppercase text-[#999] font-normal px-6 py-6 border-b border-[#1B1B1B]/10">
                Included
              </th>
              {comparison.columns.map((column) => (
                <th
                  key={column}
                  className="text-center valturin text-[17px] md:text-[19px] text-[#9C6D51] px-5 py-6 border-b border-[#1B1B1B]/10 border-l border-l-[#1B1B1B]/[0.06]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparison.rows.map((row, rowIndex) => (
              <tr
                key={row.label}
                className={`transition-colors duration-300 hover:bg-[#ccb884]/[0.09] ${
                  rowIndex % 2 === 1 ? "bg-[#1B1B1B]/[0.02]" : ""
                }`}
              >
                <th
                  scope="row"
                  className="text-left gotham text-[15px] leading-[26px] font-light text-[#444] px-6 py-5 border-b border-[#1B1B1B]/[0.07]"
                >
                  {row.label}
                </th>

                {row.values.map((value, i) => (
                  <td
                    key={`${row.label}-${comparison.columns[i] ?? i}`}
                    className="text-center px-5 py-5 border-b border-[#1B1B1B]/[0.07] border-l border-l-[#1B1B1B]/[0.06]"
                  >
                    <Cell value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {comparison.footnote && (
        <p
          data-reveal
          data-reveal-delay="4"
          className="gotham text-[15px] md:text-[17px] leading-[32px] text-[#555] font-light max-w-[840px] mx-auto text-center mt-12"
        >
          {comparison.footnote}
        </p>
      )}
    </section>
  );
}
