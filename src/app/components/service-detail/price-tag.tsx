import React from "react";
import { servicePricing } from "@/data/services/pricing";

/**
 * The member / non-member price pair.
 *
 * `badge` is the corner treatment used on service cards; `block` is the larger
 * inline treatment for heroes and tier cards. Both render nothing when the
 * service has no price, so callers don't need their own guard.
 */
export default function PriceTag({
  price,
  nonMemberPrice,
  variant = "badge",
}: {
  price?: string;
  nonMemberPrice?: string;
  variant?: "badge" | "block";
}) {
  const pricing = servicePricing(price, nonMemberPrice);
  if (!pricing) return null;

  if (variant === "badge") {
    return (
      // <div className="absolute top-5 right-5 flex flex-col items-end gap-[3px] z-10">
      <div className="flex flex-row items-end gap-2 z-10 pb-3">
        <span className="bg-[#ccb884] text-[#1B1B1B] gotham font-bold text-[13px] px-3 py-[5px] rounded-full whitespace-nowrap">
          Members {pricing.member}
        </span>
        <span className="bg-black/55  text-[#ffffff]/90 gotham font-bold text-[13px] px-3 py-[5px] rounded-full whitespace-nowrap">
          Non-Members {pricing.nonMember}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-baseline gap-2 bg-[#ccb884] text-[#1B1B1B] rounded-full px-5 py-2">
        <span className="gotham text-[11px] tracking-[2px] uppercase">Members</span>
        <span className="gotham font-bold text-[18px]">{pricing.member}</span>
      </span>
      <span className="inline-flex items-baseline gap-2 border border-current/25 rounded-full px-5 py-2 opacity-80">
        <span className="gotham text-[11px] tracking-[2px] uppercase">Non-Members</span>
        <span className="gotham font-bold text-[18px]">{pricing.nonMember}</span>
      </span>
    </div>
  );
}
