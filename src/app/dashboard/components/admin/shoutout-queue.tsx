"use client";

import React, { useState } from "react";
import { useReviewShoutout, useShoutoutQueue } from "@/lib/api/hooks/loyalty";
import type { ShoutoutStatus } from "@/lib/api/types";
import { shortDate } from "@/lib/format";
import { Card, StatusBadge } from "../dashboard-shell";

/** Approve = auto-credit the configured bonus into the loyalty ledger. */
export default function ShoutoutQueue() {
  const [status, setStatus] = useState<ShoutoutStatus>("pending");
  const { data: claims, isLoading } = useShoutoutQueue(status);
  const review = useReviewShoutout();
  const [notes, setNotes] = useState<Record<number, string>>({});

  return (
    <Card
      title="Shoutout Approval Queue"
      action={
        <div className="flex gap-1">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`gotham text-[12px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                status === s ? "bg-[#cba660] text-black font-bold" : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading claims…</p>}
      {!isLoading && (claims ?? []).length === 0 && (
        <p className="gotham text-[var(--dash-text-faint)] text-[15px]">No {status} claims.</p>
      )}

      <div className="flex flex-col divide-y divide-[var(--dash-border-soft)]">
        {(claims ?? []).map((claim) => (
          <div key={claim.id} className="py-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="min-w-[180px]">
              <p className="gotham font-bold text-[var(--dash-text)] text-[15px]">{claim.user?.name}</p>
              <p className="gotham text-[var(--dash-text-muted)] text-[13px]">
                {claim.platform} · {shortDate(claim.created_at)}
              </p>
            </div>
            <a
              href={claim.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="gotham text-[#cda873] hover:underline text-[14px] flex-1 truncate max-w-[320px]"
            >
              View proof ↗
            </a>
            {claim.status === "pending" ? (
              <div className="flex items-center gap-3 ml-auto">
                <input
                  placeholder="Notes (optional)"
                  value={notes[claim.id] ?? ""}
                  onChange={(e) => setNotes({ ...notes, [claim.id]: e.target.value })}
                  className="bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-full px-4 py-2 text-[var(--dash-text)] gotham text-[13px] placeholder:text-[var(--dash-text-faint)] focus:border-[#cba660] focus:outline-none w-[180px]"
                />
                <button
                  onClick={() => review.mutate({ id: claim.id, action: "approve", admin_notes: notes[claim.id] })}
                  disabled={review.isPending}
                  className="gotham font-bold text-[13px] bg-[#cba660] hover:bg-[#b8934e] text-black px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  Approve +pts
                </button>
                <button
                  onClick={() => review.mutate({ id: claim.id, action: "reject", admin_notes: notes[claim.id] })}
                  disabled={review.isPending}
                  className="gotham text-[13px] text-red-400 border border-red-400/40 hover:bg-red-400/10 px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="ml-auto flex items-center gap-3">
                {claim.admin_notes && (
                  <span className="gotham text-[var(--dash-text-faint)] text-[13px] italic">“{claim.admin_notes}”</span>
                )}
                <StatusBadge status={claim.status} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
