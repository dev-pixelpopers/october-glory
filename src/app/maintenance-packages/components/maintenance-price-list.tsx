"use client";

import React from "react";
import { usePackages } from "@/lib/api/hooks/catalog";

/** "200.00" -> "$200". */
function priceLabel(price: string): string {
  const n = parseFloat(price);
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : price;
}

// Shown until the API responds, so the block is never empty on first paint.
const FALLBACK = [
  { name: "The Glorious Wig Package", price: "$200" },
  { name: "The Signature Wig Package", price: "$150" },
  { name: "The Introductory Wig Package", price: "$120" },
];

/**
 * The "Package Includes" price summary in the founder's-vision section — now
 * driven by the backend maintenance packages rather than hardcoded figures.
 */
export default function MaintenancePriceList() {
  const { data: packages } = usePackages("maintenance");

  const items =
    packages && packages.length > 0
      ? packages.map((p) => ({ name: p.name, price: priceLabel(p.price) }))
      : FALLBACK;

  return (
    <div className="grid grid-cols-2 gap-y-[var(--space-8)]">
      {items.map((item) => (
        <p
          key={item.name}
          className="gotham text-[length:var(--fs-body)] leading-[1.8] text-gray-300 font-light"
        >
          {item.name}&nbsp;&nbsp;-&nbsp;&nbsp;{item.price}
        </p>
      ))}
    </div>
  );
}
