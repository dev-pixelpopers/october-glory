"use client";

import React from "react";
import { usePackages } from "@/lib/api/hooks/catalog";

/** "2400.00" -> "$2,400". */
function priceLabel(price: string): string {
  const n = parseFloat(price);
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : price;
}

// Shown until the API responds, so the block is never empty on first paint.
const FALLBACK = [
  { name: "Bride Trial Appointment", price: "$200" },
  { name: "Bridesmaid's Trial Appointment", price: "$150" },
  { name: "Full Day", price: "$2,400" },
  { name: "Half Day", price: "$1,200" },
];

/**
 * The "Package Includes" price list on the bridal page — driven by the
 * backend bridal packages, so prices changed in the dashboard show here.
 */
export default function BridalPriceList() {
  const { data: packages } = usePackages("bridal");

  const items =
    packages && packages.length > 0
      ? packages.map((p) => ({ name: p.name, price: priceLabel(p.price) }))
      : FALLBACK;

  return (
    <div className="grid grid-cols-2">
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
