"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Crown, Gift, UserRound } from "lucide-react";
import SetPasswordBanner from "@/app/components/salon/set-password-banner";
import { useAppointments, useCancelAppointment } from "@/lib/api/hooks/booking";
import {
  useLoyaltyBalance,
  useLoyaltyTransactions,
  useMyShoutouts,
} from "@/lib/api/hooks/loyalty";
import ShoutoutSubmissionForm from "./shoutout-form";
import { useSubmitReview } from "@/lib/api/hooks/reviews";
import type { Appointment, User } from "@/lib/api/types";
import { money, shortDate, timeLabel } from "@/lib/format";
import DashboardShell, { buttonGhost, buttonGold, Card, inputClass, StatusBadge } from "../dashboard-shell";
import { Modal } from "../admin/service-manager";
import { Pagination } from "../admin/audit-log-viewer";

export default function ClientDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState("appointments");

  return (
    <DashboardShell
      user={user}
      tabs={[
        { id: "appointments", label: "My Appointments", icon: CalendarDays },
        { id: "rewards", label: "Loyalty & Rewards", icon: Gift },
        { id: "membership", label: "Membership", icon: Crown },
        { id: "profile", label: "Profile", icon: UserRound },
      ]}
      activeTab={tab}
      onTabChange={setTab}
    >
      {/* Guest conversion prompt follows the client everywhere in their dashboard. */}
      {user.is_guest && tab !== "profile" && (
        <div className="mb-6">
          <SetPasswordBanner />
        </div>
      )}
      {tab === "appointments" && <AppointmentsPanel />}
      {tab === "rewards" && <RewardsHub />}
      {tab === "membership" && <MembershipPlaceholder />}
      {tab === "profile" && <ProfilePanel user={user} />}
    </DashboardShell>
  );
}

/* ---------------------------- Appointments ---------------------------------- */

function AppointmentsPanel() {
  const { data, isLoading } = useAppointments();
  const cancel = useCancelAppointment();
  const [reviewing, setReviewing] = useState<Appointment | null>(null);
  const searchParams = useSearchParams();

  // Deep link from the review-solicitation email: /dashboard?review={id}
  const reviewParam = searchParams.get("review");
  useEffect(() => {
    if (!reviewParam || !data) return;
    const target = data.data.find((a) => a.id === Number(reviewParam));
    if (target && target.status === "completed" && !target.review) setReviewing(target);
  }, [reviewParam, data]);

  const canCancel = (a: Appointment) =>
    a.status === "scheduled" &&
    new Date(a.start_time).getTime() - Date.now() > 24 * 60 * 60 * 1000;

  return (
    <>
      <Card
        title="Upcoming & Past Appointments"
        action={
          <Link href="/booking" className={buttonGold}>
            + Book New Visit
          </Link>
        }
      >
        {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading appointments…</p>}
        {!isLoading && (data?.data ?? []).length === 0 && (
          <p className="gotham text-[var(--dash-text-faint)] text-[15px]">
            Nothing booked yet — <Link href="/booking" className="text-[#cda873] hover:underline">reserve your first visit</Link>.
          </p>
        )}

        <div className="flex flex-col divide-y divide-[var(--dash-border-soft)]">
          {(data?.data ?? []).map((a) => (
            <div key={a.id} className="py-5 flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="w-[150px] shrink-0">
                <p className="gotham font-bold text-[var(--dash-text)] text-[15px]">{shortDate(a.start_time)}</p>
                <p className="gotham text-[var(--dash-text-muted)] text-[13px]">{timeLabel(a.start_time)}</p>
              </div>
              <div className="flex-1 min-w-[220px]">
                <p className="gotham text-[var(--dash-text-soft)] text-[15px]">
                  {a.services.map((s) => s.service_name).join(", ")}
                </p>
                <p className="gotham text-[var(--dash-text-muted)] text-[13px]">
                  with {a.worker?.name} · {a.booking_reference}
                </p>
              </div>
              <span className="gotham font-bold text-[#cda873] text-[16px]">{money(a.total_amount)}</span>
              <StatusBadge status={a.status} />
              <div className="flex gap-2">
                {canCancel(a) && (
                  <button
                    onClick={() => cancel.mutate(a.id)}
                    disabled={cancel.isPending}
                    className="gotham text-[13px] text-red-400 border border-red-400/40 hover:bg-red-400/10 px-4 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                {a.status === "completed" && !a.review && (
                  <button
                    onClick={() => setReviewing(a)}
                    className="gotham font-bold text-[13px] bg-[#cba660] hover:bg-[#b8934e] text-black px-4 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Leave Review
                  </button>
                )}
                {a.review && (
                  <span className="text-[#cba660] text-[14px]">{"★".repeat(a.review.rating)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {reviewing && <ReviewModal appointment={reviewing} onClose={() => setReviewing(null)} />}
    </>
  );
}

function ReviewModal({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const submit = useSubmitReview();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <Modal title={`How was your visit with ${appointment.worker?.name}?`} onClose={onClose}>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`text-[40px] transition-colors cursor-pointer ${
              star <= (hover || rating) ? "text-[#cba660]" : "text-[var(--dash-text-faint)]"
            }`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className={inputClass}
        rows={4}
        placeholder="Tell us about your experience (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {submit.error && <p className="gotham text-red-400 text-[14px] mt-3">{submit.error.message}</p>}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className={buttonGhost}>Not Now</button>
        <button
          disabled={rating === 0 || submit.isPending}
          onClick={() =>
            submit.mutate(
              { appointment_id: appointment.id, rating, comment: comment || undefined },
              { onSuccess: onClose },
            )
          }
          className={buttonGold}
        >
          {submit.isPending ? "Sending…" : "Submit Review"}
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------ Rewards hub ---------------------------------- */

function RewardsHub() {
  const { data: loyalty } = useLoyaltyBalance();
  const [page, setPage] = useState(1);
  const { data: ledger } = useLoyaltyTransactions(page);
  const { data: shoutouts } = useMyShoutouts();

  const nextMilestone = loyalty ? Math.max(100, Math.ceil((loyalty.balance + 1) / 100) * 100) : 100;
  const progress = loyalty ? Math.min(100, (loyalty.balance / nextMilestone) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Balance */}
      <Card title="Loyalty Balance">
        <div className="flex items-baseline gap-3">
          <span className="andrea text-[#cda873] text-[72px] leading-none">{loyalty?.balance ?? "—"}</span>
          <span className="gotham text-[var(--dash-text-muted)] text-[16px]">points</span>
        </div>
        <div className="mt-6">
          <div className="h-3 bg-[var(--dash-track)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9C6D51] to-[#cba660] rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="gotham text-[var(--dash-text-muted)] text-[13px] mt-2">
            {loyalty ? `${nextMilestone - loyalty.balance} points to your next ${nextMilestone}-point milestone` : ""}
          </p>
        </div>
        {loyalty && (
          <p className="gotham text-[var(--dash-text-muted)] text-[14px] mt-5">
            Each point is worth <span className="text-[#cda873] font-bold">{money(loyalty.conversion_rate)}</span> off
            at checkout. Earn <span className="text-[var(--dash-text)]">{loyalty.points_per_booking}</span> per booking and{" "}
            <span className="text-[var(--dash-text)]">{loyalty.shoutout_bonus_points}</span> per approved shoutout.
          </p>
        )}
      </Card>

      {/* Shoutout submission */}
      <Card title="Social Shoutout — Earn Bonus Points">
        <p className="gotham font-light text-[var(--dash-text-soft)] text-[15px] leading-relaxed mb-5">
          Share October Glory on your story, then upload a screenshot below. Once approved,{" "}
          {loyalty?.shoutout_bonus_points ?? 100} points land in your ledger automatically.
        </p>
        <ShoutoutSubmissionForm bonusPoints={loyalty?.shoutout_bonus_points ?? 100} />
        {(shoutouts ?? []).length > 0 && (
          <div className="mt-6 flex flex-col gap-2">
            {(shoutouts ?? []).slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="gotham text-[var(--dash-text-muted)] text-[13px]">
                  {s.platform} · {shortDate(s.created_at)}
                </span>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Ledger */}
      <Card title="Transaction History" className="lg:col-span-2">
        <div className="flex flex-col divide-y divide-[var(--dash-border-soft)]">
          {(ledger?.data ?? []).map((t) => (
            <div key={t.id} className="py-3.5 flex items-center gap-6">
              <span className="gotham text-[var(--dash-text-faint)] text-[13px] w-[110px] shrink-0">
                {shortDate(t.created_at)}
              </span>
              <span className="gotham text-[var(--dash-text-soft)] text-[15px] flex-1">{t.description}</span>
              <span
                className={`gotham font-bold text-[16px] ${t.amount > 0 ? "text-green-500" : "text-red-400"}`}
              >
                {t.amount > 0 ? `+${t.amount}` : t.amount}
              </span>
            </div>
          ))}
          {(ledger?.data ?? []).length === 0 && (
            <p className="gotham text-[var(--dash-text-faint)] text-[15px] py-3">No transactions yet.</p>
          )}
        </div>
        {ledger && ledger.meta.last_page > 1 && (
          <Pagination page={ledger.meta.current_page} lastPage={ledger.meta.last_page} onChange={setPage} />
        )}
      </Card>
    </div>
  );
}

/* ------------------------------- Profile ------------------------------------- */

function ProfilePanel({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <SetPasswordBanner />
      <Card title="Account Details">
        <dl className="flex flex-col gap-4">
          {[
            ["Name", user.name],
            ["Email", user.email],
            ["Phone", user.phone ?? "—"],
            ["Account type", user.is_guest ? "Guest (passwordless)" : "Full account"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-6">
              <dt className="gotham text-[var(--dash-text-faint)] text-[13px] uppercase tracking-widest w-[130px] shrink-0">
                {label}
              </dt>
              <dd className="gotham text-[var(--dash-text)] text-[15px]">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}

/* ------------------------------ Membership ----------------------------------- */

function MembershipPlaceholder() {
  return (
    <Card className="text-center py-16">
      <p className="andrea text-[var(--dash-text)] text-[56px] leading-none">VIP Memberships</p>
      <p className="valturin text-[#cda873] text-[30px] mt-3">Coming Soon</p>
      <p className="gotham font-light text-[var(--dash-text-muted)] text-[16px] max-w-[440px] mx-auto mt-5 leading-relaxed">
        Priority booking, member-only pricing, and exclusive treatments. Keep collecting loyalty
        points — founding members will get a head start.
      </p>
    </Card>
  );
}
