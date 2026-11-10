"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  Copy,
  Crown,
  Gift,
  Info,
  Loader2,
  Package as PackageIcon,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import SetPasswordBanner from "@/app/components/salon/set-password-banner";
import { useAppointments, useCancelAppointment } from "@/lib/api/hooks/booking";
import { usePackages, useProducts } from "@/lib/api/hooks/catalog";
import { useOrdersQuery } from "@/lib/api/hooks/ecommerce";
import { useCart } from "@/context/cart-context";
import {
  useLoyaltyBalance,
  useLoyaltyTransactions,
  useMyShoutouts,
} from "@/lib/api/hooks/loyalty";
import ShoutoutSubmissionForm from "./shoutout-form";
import { useSubmitReview } from "@/lib/api/hooks/reviews";
import type { Appointment, Package, Product, User } from "@/lib/api/types";
import { durationLabel, money, shortDate, timeLabel } from "@/lib/format";
import DashboardShell, { buttonGhost, buttonGold, Card, inputClass, StatusBadge, type NavItem } from "../dashboard-shell";
import { Modal } from "../admin/service-manager";
import { Pagination } from "../admin/audit-log-viewer";

/**
 * Client sidebar navigation, shared with /dashboard/book so the booking
 * wizard renders under the exact same dashboard chrome. "book" is a real
 * route; the rest are in-page tabs on /dashboard.
 */
export const CLIENT_NAV: NavItem[] = [
  { id: "book", label: "Book Appointment", icon: CalendarPlus },
  { id: "appointments", label: "My Appointments", icon: CalendarDays },
  { id: "orders", label: "My Orders", icon: PackageCheck },
  { id: "rewards", label: "Loyalty & Rewards", icon: Gift },
  { id: "membership", label: "Membership", icon: Crown },
  { id: "packages", label: "Packages", icon: PackageIcon },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "profile", label: "Profile", icon: UserRound },
];

export default function ClientDashboard({ user }: { user: User }) {
  const router = useRouter();
  // /dashboard?tab=rewards deep links straight to a panel (used by the
  // booking page's sidebar, which lives on its own route).
  const requested = useSearchParams().get("tab");
  const [tab, setTab] = useState(
    requested && requested !== "book" && CLIENT_NAV.some((t) => t.id === requested)
      ? requested
      : "appointments",
  );

  return (
    <DashboardShell
      user={user}
      tabs={CLIENT_NAV}
      activeTab={tab}
      onTabChange={(id) => (id === "book" ? router.push("/dashboard/book") : setTab(id))}
    >
      {/* Guest conversion prompt follows the client everywhere in their dashboard. */}
      {user.is_guest && tab !== "profile" && (
        <div className="mb-6">
          <SetPasswordBanner />
        </div>
      )}
      {tab === "appointments" && <AppointmentsPanel />}
      {tab === "orders" && <ClientOrdersPanel user={user} />}
      {tab === "rewards" && <RewardsHub />}
      {tab === "membership" && <MembershipPanel user={user} />}
      {tab === "packages" && <PackagesPanel />}
      {tab === "shop" && <ShopPanel />}
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
          <Link href="/dashboard/book" className={buttonGold}>
            + Book New Visit
          </Link>
        }
      >
        {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading appointments…</p>}
        {!isLoading && (data?.data ?? []).length === 0 && (
          <p className="gotham text-[var(--dash-text-faint)] text-[15px]">
            Nothing booked yet — <Link href="/dashboard/book" className="text-[#cda873] hover:underline">reserve your first visit</Link>.
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
                {a.package && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#cba660]/20 text-[#cda873] text-[11px] font-bold uppercase tracking-wider mb-1">
                    Package · {a.package.name}
                  </div>
                )}
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

/* ------------------------------- Packages ------------------------------------ */

/**
 * The salon's packages, grouped or filtered by category/collection
 * (Silk Press, Maintenance, Glorious, Bridal).
 */
function PackagesPanel() {
  const { data: packages, isLoading, error } = usePackages();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePackage, setActivePackage] = useState<Package | null>(null);

  // Derive categories and their counts
  const categoryCounts = new Map<string, number>();
  for (const pkg of packages ?? []) {
    const key = pkg.category?.name ?? (pkg.collection ? pkg.collection.charAt(0).toUpperCase() + pkg.collection.slice(1) : "More Packages");
    categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
  }

  const categoryList = Array.from(categoryCounts.keys());

  // Filter packages
  const filtered = (packages ?? []).filter((pkg) => {
    if (selectedCategory === "all") return true;
    const catName = pkg.category?.name ?? (pkg.collection ? pkg.collection.charAt(0).toUpperCase() + pkg.collection.slice(1) : "More Packages");
    return catName.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Group for section rendering when "all" is active
  const groups = new Map<string, Package[]>();
  for (const pkg of filtered) {
    const key = pkg.category?.name ?? (pkg.collection ? pkg.collection.charAt(0).toUpperCase() + pkg.collection.slice(1) : "More Packages");
    groups.set(key, [...(groups.get(key) ?? []), pkg]);
  }

  return (
    <>
      <Card
        title="Curated Packages"
        action={
          <Link
            href="/dashboard/book"
            className="flex items-center gap-2 gotham font-bold text-[13px] bg-[#cba660] hover:bg-[#b8934e] text-black px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm"
          >
            <span>Book Consultation</span>
            <ArrowRight size={14} />
          </Link>
        }
      >
        <p className="gotham font-light text-[var(--dash-text-soft)] text-[15px] leading-relaxed mb-6 max-w-[800px]">
          Comprehensive service bundles combining cleansing, steam treatments, precision styling, and maintenance at exclusive package rates.
        </p>

        {/* Category Filter Tabs */}
        {categoryList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-[var(--dash-border-soft)]">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`gotham text-[13px] px-4 py-2 rounded-full border transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "border-[#cba660] bg-[#cba660]/15 text-[#cda873] font-medium shadow-sm"
                  : "border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] hover:border-[var(--dash-border-strong)]"
              }`}
            >
              All Packages ({packages?.length ?? 0})
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`gotham text-[13px] px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "border-[#cba660] bg-[#cba660]/15 text-[#cda873] font-medium shadow-sm"
                    : "border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] hover:border-[var(--dash-border-strong)]"
                }`}
              >
                {cat} ({categoryCounts.get(cat)})
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="py-12 text-center">
            <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading signature packages…</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-[14px] bg-red-500/10 border border-red-500/20 text-red-400 text-[14px]">
            {error.message}
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="gotham text-[var(--dash-text-faint)] text-[15px]">No packages found in this category.</p>
          </div>
        )}

        <div className="flex flex-col gap-10">
          {[...groups].map(([name, items]) => (
            <section key={name}>
              {selectedCategory === "all" && groups.size > 1 && (
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="gotham font-bold text-[#cba660] text-[13px] uppercase tracking-[0.25em]">
                    {name}
                  </h3>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--dash-border-soft)] to-transparent" />
                  <span className="gotham text-[12px] text-[var(--dash-text-faint)]">
                    {items.length} {items.length === 1 ? "package" : "packages"}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7">
                {items.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onSelect={() => setActivePackage(pkg)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Card>

      {/* Package Details Modal */}
      {activePackage && (
        <PackageDetailModal
          pkg={activePackage}
          onClose={() => setActivePackage(null)}
        />
      )}
    </>
  );
}

function PackageCard({
  pkg,
  onSelect,
}: {
  pkg: Package;
  onSelect: () => void;
}) {
  const servicesTotal = parseFloat(pkg.services_total || "0");
  const packagePrice = parseFloat(pkg.price || "0");
  const savings = servicesTotal > packagePrice ? Math.round(servicesTotal - packagePrice) : 0;

  return (
    <div
      className={`group flex flex-col rounded-[22px] overflow-hidden bg-[var(--dash-card)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] ${
        pkg.is_featured
          ? "border-[#cba660]/60 shadow-[0_4px_24px_rgba(203,166,96,0.12)] bg-gradient-to-b from-[#cba660]/[0.03] to-[var(--dash-card)]"
          : "border-[var(--dash-border)] hover:border-[#cba660]/50"
      }`}
    >
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1f1f1f]">
        {pkg.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
            <PackageIcon size={36} className="text-[#cba660]/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {(pkg.category?.name || pkg.collection) && (
            <span className="gotham text-[11px] font-medium tracking-wider uppercase backdrop-blur-md bg-black/60 text-white/90 px-3 py-1 rounded-full border border-white/10 shadow-sm">
              {pkg.category?.name ?? pkg.collection}
            </span>
          )}

          {pkg.is_featured && (
            <span className="ml-auto flex items-center gap-1.5 gotham text-[11px] font-bold tracking-widest uppercase backdrop-blur-md bg-gradient-to-r from-[#cda873] to-[#e4cc9e] text-black px-3 py-1 rounded-full shadow-lg">
              <Sparkles size={12} className="fill-black" />
              Signature
            </span>
          )}
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {pkg.duration_minutes > 0 && (
            <span className="flex items-center gap-1.5 gotham text-[12px] font-medium backdrop-blur-md bg-black/65 text-white/90 px-2.5 py-1 rounded-full border border-white/10">
              <Clock size={13} className="text-[#cda873]" />
              {durationLabel(pkg.duration_minutes)}
            </span>
          )}

          {savings > 0 && (
            <span className="ml-auto flex items-center gap-1 gotham text-[11px] font-bold backdrop-blur-md bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Save ${savings}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Title and Tagline */}
        <div className="mb-3">
          <h4 className="valturin text-[22px] md:text-[24px] leading-[1.25] text-[var(--dash-text)] group-hover:text-[#cda873] transition-colors">
            {pkg.name}
          </h4>
          {pkg.tagline && (
            <p className="gotham font-light text-[var(--dash-text-muted)] text-[13px] leading-relaxed line-clamp-2 mt-1.5">
              {pkg.tagline}
            </p>
          )}
        </div>

        {/* Price and Best For Strip */}
        <div className="flex items-baseline justify-between gap-2 py-3 border-y border-[var(--dash-border-soft)] mb-4">
          <div>
            <span className="gotham text-[11px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-0.5">
              Package Price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="valturin text-[26px] font-bold text-[#cda873]">
                {money(pkg.price)}
              </span>
              {savings > 0 && (
                <span className="gotham text-[13px] text-[var(--dash-text-faint)] line-through">
                  {money(pkg.services_total)}
                </span>
              )}
            </div>
          </div>

          {pkg.best_for && (
            <div className="text-right max-w-[50%]">
              <span className="gotham text-[11px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-0.5">
                Best For
              </span>
              <span className="gotham text-[12px] text-[var(--dash-text-soft)] line-clamp-1">
                {pkg.best_for}
              </span>
            </div>
          )}
        </div>

        {/* What's Included */}
        {pkg.includes.length > 0 && (
          <div className="mb-5">
            <p className="gotham text-[11px] uppercase tracking-[2px] text-[var(--dash-text-faint)] font-medium mb-2.5">
              What&apos;s Included
            </p>
            <ul className="flex flex-col gap-2">
              {pkg.includes.slice(0, 3).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[13px] text-[var(--dash-text-soft)] gotham font-light"
                >
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#cba660]/15 text-[#cda873] shrink-0 mt-0.5">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span className="line-clamp-1 leading-tight">{item}</span>
                </li>
              ))}
            </ul>
            {pkg.includes.length > 3 && (
              <button
                type="button"
                onClick={onSelect}
                className="gotham text-[12px] text-[#cda873] hover:underline font-medium mt-2 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>+{pkg.includes.length - 3} more included services</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 flex items-center gap-3">
          <Link
            href={`/dashboard/book?package=${encodeURIComponent(pkg.slug)}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#cba660] hover:bg-[#b8934e] text-black gotham font-bold text-[13px] tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Book Package</span>
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            onClick={onSelect}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] text-[var(--dash-text-muted)] hover:text-[#cba660] transition-colors cursor-pointer shrink-0"
            title="View Package Details"
            aria-label="View Package Details"
          >
            <Info size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageDetailModal({
  pkg,
  onClose,
}: {
  pkg: Package;
  onClose: () => void;
}) {
  const servicesTotal = parseFloat(pkg.services_total || "0");
  const packagePrice = parseFloat(pkg.price || "0");
  const savings = servicesTotal > packagePrice ? Math.round(servicesTotal - packagePrice) : 0;

  return (
    <Modal title={pkg.name} onClose={onClose}>
      <div className="flex flex-col gap-6">
        {pkg.image && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] bg-[#1a1a1a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              {(pkg.category?.name || pkg.collection) && (
                <span className="gotham text-[11px] font-medium tracking-wider uppercase backdrop-blur-md bg-black/60 text-white/90 px-3 py-1 rounded-full border border-white/10">
                  {pkg.category?.name ?? pkg.collection}
                </span>
              )}
              {pkg.duration_minutes > 0 && (
                <span className="flex items-center gap-1.5 gotham text-[12px] text-white/90 backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                  <Clock size={13} className="text-[#cda873]" />
                  {durationLabel(pkg.duration_minutes)}
                </span>
              )}
            </div>
          </div>
        )}

        {(pkg.tagline || pkg.description) && (
          <div>
            {pkg.tagline && (
              <p className="valturin text-[20px] text-[#cda873] leading-snug">
                {pkg.tagline}
              </p>
            )}
            {pkg.description && (
              <p className="gotham font-light text-[var(--dash-text-soft)] text-[14px] leading-relaxed mt-2">
                {pkg.description}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-[16px] bg-[var(--dash-elev)] border border-[var(--dash-border-soft)]">
          <div>
            <span className="gotham text-[11px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-0.5">
              Package Investment
            </span>
            <div className="flex items-baseline gap-2">
              <span className="valturin text-[28px] font-bold text-[#cda873]">
                {money(pkg.price)}
              </span>
              {savings > 0 && (
                <span className="gotham text-[14px] text-[var(--dash-text-faint)] line-through">
                  {money(pkg.services_total)}
                </span>
              )}
            </div>
          </div>
          {savings > 0 && (
            <div className="text-right">
              <span className="gotham text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full inline-block">
                Save ${savings} Bundled
              </span>
            </div>
          )}
        </div>

        {pkg.best_for && (
          <div className="p-3.5 rounded-[14px] bg-[#cba660]/10 border border-[#cba660]/20 text-[13px] gotham">
            <span className="text-[#cda873] font-bold block mb-1 uppercase tracking-wider text-[11px]">
              Ideal Candidate
            </span>
            <p className="text-[var(--dash-text-soft)] font-light leading-relaxed">
              {pkg.best_for}
            </p>
          </div>
        )}

        {pkg.includes.length > 0 && (
          <div>
            <h5 className="gotham font-bold text-[var(--dash-text)] text-[13px] uppercase tracking-wider mb-3">
              Included Treatments &amp; Services
            </h5>
            <ul className="flex flex-col gap-2.5">
              {pkg.includes.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[14px] text-[var(--dash-text-soft)] gotham font-light"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#cba660]/20 text-[#cda873] shrink-0 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.not_included && (
          <div className="text-[12px] gotham text-[var(--dash-text-muted)] border-t border-[var(--dash-border-soft)] pt-3">
            <span className="font-medium text-[var(--dash-text-soft)]">Please note: </span>
            {pkg.not_included}
          </div>
        )}

        <div className="pt-2">
          <Link
            href={`/dashboard/book?package=${encodeURIComponent(pkg.slug)}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-[#cba660] hover:bg-[#b8934e] text-black gotham font-bold text-[14px] tracking-wider uppercase transition-colors shadow-md"
          >
            <span>Proceed to Booking</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </Modal>
  );
}

/* ----------------------------- Client Orders --------------------------------- */

const ORDER_TIMELINE_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function getTimelineIndex(status: string): number {
  switch (status) {
    case "pending":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return -1;
  }
}

function ClientOrdersPanel({ user }: { user: User }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useOrdersQuery(page);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 2500);
  };

  return (
    <div className="space-y-6">
      <Card
        title="My Orders & Shipments"
        action={
          <Link href="/shop" className={buttonGold}>
            + Shop Collection
          </Link>
        }
      >
        <p className="gotham font-light text-[var(--dash-text-soft)] text-[15px] leading-relaxed mb-6">
          Track fulfillment progress, view courier tracking details, and review order receipts.
        </p>

        {isLoading && (
          <div className="py-16 text-center text-[var(--dash-text-muted)]">
            <Loader2 size={24} className="mx-auto mb-2 animate-spin text-[#cda873]" />
            <p className="gotham text-[14px]">Loading your orders…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 text-red-200 text-xs gotham mb-4">
            {error.message || "Unable to load orders at this time."}
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="py-16 text-center text-[var(--dash-text-faint)]">
            <PackageCheck size={40} className="mx-auto mb-3 opacity-30 text-[var(--dash-text)]" />
            <h4 className="valturin text-xl text-white mb-2">No Orders Placed Yet</h4>
            <p className="gotham text-sm text-[var(--dash-text-muted)] max-w-sm mx-auto mb-6 leading-relaxed">
              Discover our bespoke units, hair bundles, and salon-grade care products.
            </p>
            <Link href="/shop" className={buttonGold}>
              Explore Studio Shop
            </Link>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIndex = getTimelineIndex(order.status);
              const isCancelled = order.status === "cancelled";

              return (
                <div
                  key={order.id}
                  className="bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-[20px] overflow-hidden transition-all hover:border-[#cba660]/40 shadow-sm"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[var(--dash-border-soft)] bg-[var(--dash-card)]/50">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[var(--dash-text)] gotham text-[15px]">
                          #{order.order_number}
                        </span>
                        <StatusBadge status={order.status} />
                        <StatusBadge status={order.payment_status} />
                      </div>
                      <p className="gotham text-xs text-[var(--dash-text-muted)] mt-1">
                        Placed on {shortDate(order.created_at)} · {order.total_items}{" "}
                        {order.total_items === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="gotham text-[12px] text-[var(--dash-text-muted)] block">
                        Order Total
                      </span>
                      <span className="gotham font-bold text-[#cda873] text-[18px]">
                        {money(order.pricing?.total ?? 0)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6">
                    {/* Status Progress Timeline */}
                    {!isCancelled ? (
                      <div>
                        <div className="relative flex items-center justify-between max-w-xl mx-auto my-3">
                          {/* Background Track Line */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--dash-border)] z-0 rounded-full" />
                          {/* Active Gold Track Line */}
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#9C6D51] to-[#cba660] z-0 rounded-full transition-all duration-500"
                            style={{
                              width: `${(Math.max(0, currentStepIndex) / (ORDER_TIMELINE_STEPS.length - 1)) * 100}%`,
                            }}
                          />

                          {ORDER_TIMELINE_STEPS.map((step, idx) => {
                            const isDone = currentStepIndex > idx;
                            const isCurrent = currentStepIndex === idx;

                            return (
                              <div
                                key={step.key}
                                className="relative z-10 flex flex-col items-center"
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                                    isDone
                                      ? "bg-[#cba660] text-black font-bold"
                                      : isCurrent
                                      ? "bg-[#1B1B1B] border-2 border-[#cba660] text-[#cda873] shadow-[0_0_12px_rgba(203,166,96,0.5)]"
                                      : "bg-[var(--dash-card)] border border-[var(--dash-border)] text-[var(--dash-text-faint)]"
                                  }`}
                                >
                                  {isDone ? (
                                    <Check size={14} strokeWidth={3} />
                                  ) : (
                                    <span className="text-[11px] font-bold">{idx + 1}</span>
                                  )}
                                </div>
                                <span
                                  className={`gotham text-[11px] mt-2 whitespace-nowrap ${
                                    isCurrent
                                      ? "text-[#cda873] font-bold"
                                      : isDone
                                      ? "text-[var(--dash-text)] font-medium"
                                      : "text-[var(--dash-text-faint)]"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3.5 flex items-center gap-3 text-red-300 text-xs gotham">
                        <AlertCircle size={16} className="text-red-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-red-200">Order Cancelled</p>
                          <p className="mt-0.5 text-red-300/80">
                            This order was cancelled. Please contact concierge if you have any questions.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tracking Box if available */}
                    {order.shipping?.tracking_number && (
                      <div className="bg-[#cba660]/10 border border-[#cba660]/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs gotham">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#cba660]/20 flex items-center justify-center text-[#cda873]">
                            <Truck size={16} />
                          </div>
                          <div>
                            <span className="text-[var(--dash-text-faint)] uppercase tracking-wider block text-[10px]">
                              Carrier Tracking
                            </span>
                            <span className="font-mono text-white text-[13px] font-semibold">
                              {order.shipping.tracking_number}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyTracking(order.shipping.tracking_number!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#cba660]/40 text-[#cda873] hover:bg-[#cba660]/20 transition-colors cursor-pointer"
                        >
                          <Copy size={13} />
                          <span>
                            {copiedTracking === order.shipping.tracking_number
                              ? "Copied!"
                              : "Copy Number"}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Items Grid & Shipping Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                      {/* Items Column (2/3) */}
                      <div className="lg:col-span-2 space-y-3">
                        <span className="text-[var(--dash-text-faint)] text-[11px] uppercase tracking-wider font-semibold block gotham">
                          Ordered Items
                        </span>
                        <div className="space-y-2">
                          {(order.items ?? []).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--dash-card)] border border-[var(--dash-border-soft)] text-xs gotham"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-12 h-12 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/5">
                                  {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                      <PackageCheck size={18} />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[var(--dash-text)] font-medium truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-[var(--dash-text-muted)] text-[11px] mt-0.5">
                                    Quantity: {item.quantity} · {money(item.unit_price)} each
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-bold text-[#cda873] text-[13px]">
                                  {money(item.line_total)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Payment Destination (1/3) */}
                      <div className="bg-[var(--dash-card)] border border-[var(--dash-border-soft)] rounded-xl p-4 text-xs gotham space-y-3 h-fit">
                        <div>
                          <span className="text-[var(--dash-text-faint)] uppercase tracking-wider block font-semibold text-[10px] mb-1">
                            Delivery Destination
                          </span>
                          <p className="text-[var(--dash-text)] font-medium">
                            {order.customer_name}
                          </p>
                          <p className="text-[var(--dash-text-muted)] mt-0.5">
                            {order.shipping?.address_line1}
                            {order.shipping?.address_line2
                              ? `, ${order.shipping.address_line2}`
                              : ""}
                          </p>
                          <p className="text-[var(--dash-text-muted)]">
                            {order.shipping?.city}, {order.shipping?.state}{" "}
                            {order.shipping?.postal_code}
                          </p>
                          <p className="text-[#cda873] font-medium mt-1 uppercase tracking-wider text-[11px]">
                            {order.shipping?.method?.replace(/_/g, " ") ?? "Standard"} Delivery
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[var(--dash-border-soft)] space-y-1 text-[var(--dash-text-muted)]">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-[var(--dash-text)]">
                              {money(order.pricing?.subtotal ?? 0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-[#cda873]">
                              {order.pricing?.shipping === 0
                                ? "Complimentary"
                                : money(order.pricing?.shipping ?? 0)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[var(--dash-border-soft)]">
                            <span>Total</span>
                            <span className="text-[#cda873]">
                              {money(order.pricing?.total ?? 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-[var(--dash-border-soft)] text-[13px] gotham text-[var(--dash-text-muted)]">
            <p>
              Showing {(meta.current_page - 1) * meta.per_page + 1} to{" "}
              {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3.5 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2 font-medium text-[var(--dash-text)]">
                {page} / {meta.last_page}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page >= meta.last_page}
                className="px-3.5 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* --------------------------------- Shop -------------------------------------- */

/**
 * The shop catalog: client product dashboard where users can explore,
 * view details, add to cart, and purchase immediately.
 */
function ShopPanel() {
  const { data: products, isLoading, error } = useProducts();
  const [category, setCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = Array.from(
    new Set((products ?? []).map((p) => p.category).filter((c): c is string => !!c)),
  );
  const shown = (products ?? []).filter((p) => !category || p.category === category);

  return (
    <>
      <Card
        title="Shop October Glory"
        action={
          <Link
            href="/shop"
            className="gotham text-[13px] text-[#cda873] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Visit Full Boutique</span>
            <ArrowRight size={13} />
          </Link>
        }
      >
        <p className="gotham font-light text-[var(--dash-text-soft)] text-[15px] leading-relaxed mb-6">
          Hand-crafted custom units, virgin bundles, closures, and the professional styling products used in our studio.
        </p>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[null, ...categories].map((c) => (
              <button
                key={c ?? "all"}
                onClick={() => setCategory(c)}
                className={`gotham text-[13px] px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
                  category === c
                    ? "border-[#cba660] bg-[#cba660]/15 text-[#cda873] font-semibold"
                    : "border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
                }`}
              >
                {c ?? "All Collections"}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="py-16 text-center text-[var(--dash-text-muted)]">
            <Loader2 size={24} className="mx-auto mb-2 animate-spin text-[#cda873]" />
            <p className="gotham text-[14px]">Loading shop products…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 text-red-200 text-xs gotham mb-4">
            {error.message || "Failed to load products."}
          </div>
        )}

        {!isLoading && !error && shown.length === 0 && (
          <p className="gotham text-[var(--dash-text-faint)] text-[15px] py-12 text-center">
            No products to show in this category.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shown.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={() => setSelectedProduct(p)}
            />
          ))}
        </div>
      </Card>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: () => void;
}) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const image = product.image ?? product.gallery?.[0] ?? product.background_image;
  const spec = [product.length, product.texture, product.color].filter(Boolean).join(" · ");
  const inStock = (product.stock ?? 1) > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) return;
    addItem(product, 1);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) return;
    addItem(product, 1);
    router.push("/checkout");
  };

  return (
    <div
      className={`group flex flex-col rounded-[22px] overflow-hidden bg-[var(--dash-card)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] ${
        product.is_featured
          ? "border-[#cba660]/60 shadow-[0_4px_24px_rgba(203,166,96,0.12)] bg-gradient-to-b from-[#cba660]/[0.03] to-[var(--dash-card)]"
          : "border-[var(--dash-border)] hover:border-[#cba660]/50"
      }`}
    >
      {/* Cover Image & Badges */}
      <div
        onClick={onSelect}
        className="relative aspect-[16/11] w-full overflow-hidden bg-[#1f1f1f] cursor-pointer"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
            <ShoppingBag size={36} className="text-[#cba660]/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {product.category && (
            <span className="gotham text-[11px] font-medium tracking-wider uppercase backdrop-blur-md bg-black/60 text-white/90 px-3 py-1 rounded-full border border-white/10 shadow-sm">
              {product.category}
            </span>
          )}

          {product.is_featured && (
            <span className="ml-auto flex items-center gap-1.5 gotham text-[11px] font-bold tracking-widest uppercase backdrop-blur-md bg-gradient-to-r from-[#cda873] to-[#e4cc9e] text-black px-3 py-1 rounded-full shadow-lg">
              <Sparkles size={11} className="fill-black" />
              Featured
            </span>
          )}
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className={`gotham text-[11px] font-medium backdrop-blur-md px-2.5 py-0.5 rounded-full border ${
              inStock
                ? "bg-black/65 text-emerald-300 border-emerald-500/30"
                : "bg-red-950/80 text-red-300 border-red-500/40"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>

          {spec && (
            <span className="gotham text-[11px] text-white/80 backdrop-blur-md bg-black/60 px-2 py-0.5 rounded-full border border-white/10 truncate max-w-[130px]">
              {spec}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title and Specs */}
        <div className="mb-2">
          <h4
            onClick={onSelect}
            className="valturin text-[20px] text-[var(--dash-text)] group-hover:text-[#cda873] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h4>
          {spec && (
            <p className="gotham text-[12px] text-[var(--dash-text-muted)] mt-1 line-clamp-1">
              {spec}
            </p>
          )}
        </div>

        {/* Description snippet */}
        {product.description && (
          <p className="gotham font-light text-[var(--dash-text-soft)] text-[13px] leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
        )}

        {/* Price Strip */}
        <div className="flex items-baseline justify-between gap-2 py-3 border-y border-[var(--dash-border-soft)] mt-auto mb-4">
          <div>
            <span className="gotham text-[10px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-0.5">
              Investment
            </span>
            <span className="valturin text-[24px] font-bold text-[#cda873]">
              {money(product.price)}
            </span>
          </div>
          {product.stock !== null && product.stock !== undefined && inStock && (
            <span className="gotham text-[11px] text-[var(--dash-text-muted)]">
              {product.stock <= 3 ? `Only ${product.stock} left` : "Ready to ship"}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {inStock ? (
            <>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-2.5 px-3 rounded-full bg-[#cba660] hover:bg-[#b8934e] text-black gotham font-bold text-[12px] tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer text-center"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                title="Add to Shopping Bag"
                aria-label="Add to Shopping Bag"
                className="w-10 h-10 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] bg-[var(--dash-bg)] text-[#cda873] hover:text-white hover:bg-[#cba660]/20 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                {added ? <Check size={16} className="text-emerald-400" /> : <ShoppingBag size={16} />}
              </button>

              <button
                type="button"
                onClick={onSelect}
                title="View Product Details"
                aria-label="View Product Details"
                className="w-10 h-10 rounded-full border border-[var(--dash-border)] hover:border-[var(--dash-border-strong)] text-[var(--dash-text-muted)] hover:text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Info size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-3 rounded-full bg-white/5 border border-white/10 text-[var(--dash-text-faint)] gotham text-[12px] uppercase tracking-wider cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const image = product.image ?? product.gallery?.[0] ?? product.background_image;
  const spec = [product.length, product.texture, product.color].filter(Boolean).join(" · ");
  const inStock = (product.stock ?? 1) > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(product, 1);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addItem(product, 1);
    onClose();
    router.push("/checkout");
  };

  return (
    <Modal title={product.name} onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Cover Preview */}
        {image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-[#1a1a1a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              {product.category && (
                <span className="gotham text-[11px] font-medium tracking-wider uppercase backdrop-blur-md bg-black/60 text-white/90 px-3 py-1 rounded-full border border-white/10">
                  {product.category}
                </span>
              )}
              <span
                className={`gotham text-[11px] font-medium backdrop-blur-md px-3 py-1 rounded-full border ${
                  inStock
                    ? "bg-black/65 text-emerald-300 border-emerald-500/30"
                    : "bg-red-950/80 text-red-300 border-red-500/40"
                }`}
              >
                {inStock ? "In Stock · Ready to Ship" : "Sold Out"}
              </span>
            </div>
          </div>
        )}

        {/* Price & Specs Banner */}
        <div className="flex items-center justify-between p-4 rounded-[16px] bg-[var(--dash-bg)] border border-[var(--dash-border-soft)]">
          <div>
            <span className="gotham text-[11px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-0.5">
              Price
            </span>
            <span className="valturin text-[28px] font-bold text-[#cda873]">
              {money(product.price)}
            </span>
          </div>
          {spec && (
            <div className="text-right">
              <span className="gotham text-[11px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-0.5">
                Specifications
              </span>
              <span className="gotham text-[13px] text-[var(--dash-text)] font-medium">
                {spec}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h5 className="gotham font-bold text-[var(--dash-text)] text-[12px] uppercase tracking-wider mb-2">
              Product Overview
            </h5>
            <p className="gotham font-light text-[var(--dash-text-soft)] text-[14px] leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Showcase Narrative if provided */}
        {(product.what_she_wanted || product.what_we_built || product.how_she_wears_it) && (
          <div className="space-y-3 pt-3 border-t border-[var(--dash-border-soft)]">
            <h5 className="gotham font-bold text-[#cda873] text-[12px] uppercase tracking-wider">
              Studio Craftsmanship &amp; Build
            </h5>

            {product.what_she_wanted && (
              <div className="p-3 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border-soft)] text-xs gotham">
                <span className="font-semibold text-[var(--dash-text)] block mb-1">
                  What She Wanted:
                </span>
                <p className="text-[var(--dash-text-muted)] font-light leading-relaxed">
                  {product.what_she_wanted}
                </p>
              </div>
            )}

            {product.what_we_built && (
              <div className="p-3 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border-soft)] text-xs gotham">
                <span className="font-semibold text-[var(--dash-text)] block mb-1">
                  What We Built:
                </span>
                <p className="text-[var(--dash-text-muted)] font-light leading-relaxed">
                  {product.what_we_built}
                </p>
              </div>
            )}

            {product.how_she_wears_it && (
              <div className="p-3 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border-soft)] text-xs gotham">
                <span className="font-semibold text-[var(--dash-text)] block mb-1">
                  How She Wears It:
                </span>
                <p className="text-[var(--dash-text-muted)] font-light leading-relaxed">
                  {product.how_she_wears_it}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {inStock ? (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] text-[#cda873] hover:text-white hover:bg-[#cba660]/10 gotham font-bold text-[13px] tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {added ? <Check size={16} className="text-emerald-400" /> : <ShoppingBag size={16} />}
                <span>{added ? "Added to Bag" : "Add to Shopping Bag"}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-5 rounded-full bg-[#cba660] hover:bg-[#b8934e] text-black gotham font-bold text-[13px] tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-5 rounded-full bg-white/5 border border-white/10 text-gray-500 gotham font-bold text-[13px] uppercase tracking-wider cursor-not-allowed text-center"
            >
              Currently Out of Stock
            </button>
          )}
        </div>
      </div>
    </Modal>
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

function MembershipPanel({ user }: { user: User }) {
  const percent = Math.round(user.member_discount_rate * 100);

  if (user.is_member) {
    return (
      <Card className="text-center py-16">
        <p className="andrea text-[var(--dash-text)] text-[56px] leading-none">Glory Member</p>
        <p className="valturin text-[#cda873] text-[30px] mt-3">{percent}% Off Every Service</p>
        <p className="gotham font-light text-[var(--dash-text-muted)] text-[16px] max-w-[440px] mx-auto mt-5 leading-relaxed">
          Your member discount is applied automatically at checkout, before any loyalty points.
          {user.membership_ends_at && <> Your membership runs until {shortDate(user.membership_ends_at)}.</>}
        </p>
      </Card>
    );
  }

  return (
    <Card className="text-center py-16">
      <p className="andrea text-[var(--dash-text)] text-[56px] leading-none">VIP Memberships</p>
      <p className="valturin text-[#cda873] text-[30px] mt-3">Members Save {percent}%</p>
      <p className="gotham font-light text-[var(--dash-text-muted)] text-[16px] max-w-[440px] mx-auto mt-5 leading-relaxed">
        Members get {percent}% off every service, priority booking, and loyalty points on everything.
        Ask at your next visit to become a Glory Member.
      </p>
    </Card>
  );
}
