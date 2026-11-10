"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  Star,
  Sparkles,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Filter,
  RefreshCw,
  ArrowRight,
  Scissors,
  Boxes,
  ShoppingBag,
  Users,
  Crown,
  Gift,
  Megaphone,
  ScrollText,
  BarChart3,
  CalendarDays,
  CalendarPlus,
  PackageCheck,
  Package as PackageIcon,
  UserRound,
} from "lucide-react";
import AuthGate from "@/app/components/salon/auth-gate";
import { useMe } from "@/lib/api/hooks/auth";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/lib/api/hooks/use-notifications";
import type { AppNotification, User } from "@/lib/api/types";
import DashboardShell, { type NavItem } from "../components/dashboard-shell";

const ADMIN_NAV: NavItem[] = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "calendar", label: "Master Calendar", icon: CalendarDays },
  { id: "services", label: "Services & Pricing", icon: Scissors },
  { id: "packages", label: "Packages", icon: Boxes },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "orders", label: "Orders", icon: PackageCheck },
  { id: "workers", label: "Workers", icon: Users },
  { id: "clients", label: "Clients & Members", icon: Crown },
  { id: "loyalty", label: "Loyalty Settings", icon: Gift },
  { id: "shoutouts", label: "Shoutout Queue", icon: Megaphone },
  { id: "audit", label: "Audit Log", icon: ScrollText },
];

const WORKER_NAV: NavItem[] = [
  { id: "schedule", label: "My Schedule", icon: CalendarDays },
  { id: "performance", label: "My Performance", icon: Star },
];

const CLIENT_NAV: NavItem[] = [
  { id: "book", label: "Book Appointment", icon: CalendarPlus },
  { id: "appointments", label: "My Appointments", icon: CalendarDays },
  { id: "orders", label: "My Orders", icon: PackageCheck },
  { id: "rewards", label: "Loyalty & Rewards", icon: Gift },
  { id: "membership", label: "Membership", icon: Crown },
  { id: "packages", label: "Packages", icon: PackageIcon },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "profile", label: "Profile", icon: UserRound },
];

function formatTimestamp(dateStr: string): { relative: string; full: string } {
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let relative = "just now";
    if (diffSeconds >= 60 && diffSeconds < 3600) {
      relative = `${Math.floor(diffSeconds / 60)}m ago`;
    } else if (diffSeconds >= 3600 && diffSeconds < 86400) {
      relative = `${Math.floor(diffSeconds / 3600)}h ago`;
    } else if (diffSeconds >= 86400 && diffSeconds < 604800) {
      relative = `${Math.floor(diffSeconds / 86400)}d ago`;
    } else if (diffSeconds >= 604800) {
      relative = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }

    const full = date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    return { relative, full };
  } catch {
    return { relative: dateStr, full: dateStr };
  }
}

function getNotificationBadge(type: string) {
  if (type.includes("appointment")) {
    return {
      label: "Appointment",
      icon: <Calendar size={15} className="text-[#cba660]" />,
      bg: "bg-[#cba660]/10 text-[#cda873] border-[#cba660]/20",
    };
  }
  if (type.includes("service")) {
    return {
      label: "Service",
      icon: <Scissors size={15} className="text-purple-400" />,
      bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };
  }
  if (type.includes("package")) {
    return {
      label: "Package",
      icon: <Boxes size={15} className="text-blue-400" />,
      bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
  }
  if (type.includes("order")) {
    return {
      label: "Order",
      icon: <PackageCheck size={15} className="text-[#cba660]" />,
      bg: "bg-[#cba660]/10 text-[#cda873] border-[#cba660]/20",
    };
  }
  if (type.includes("product")) {
    return {
      label: "Product",
      icon: <ShoppingBag size={15} className="text-emerald-400" />,
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
  }
  if (type.includes("shoutout")) {
    return {
      label: "Shoutout",
      icon: <Sparkles size={15} className="text-amber-400" />,
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
  }
  if (type.includes("review")) {
    return {
      label: "Review",
      icon: <Star size={15} className="text-yellow-400" />,
      bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };
  }
  if (type.includes("user")) {
    return {
      label: "Account",
      icon: <CheckCircle2 size={15} className="text-emerald-400" />,
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
  }
  return {
    label: "System",
    icon: <AlertCircle size={15} className="text-sky-400" />,
    bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  };
}

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#151515] flex items-center justify-center">
          <p className="gotham text-white/60 text-[18px]">Loading…</p>
        </div>
      }
    >
      <AuthGate>
        <NotificationsView />
      </AuthGate>
    </Suspense>
  );
}

function NotificationsView() {
  const { data: me } = useMe();
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  if (!me) return null;

  // Determine base nav tabs for current user role
  const baseTabs =
    me.role === "admin"
      ? ADMIN_NAV
      : me.role === "worker"
      ? WORKER_NAV
      : CLIENT_NAV;

  const tabsWithNotifications: NavItem[] = [
    ...baseTabs,
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === "notifications") return;
    if (tabId === "book") {
      router.push("/dashboard/book");
    } else {
      router.push(`/dashboard?tab=${tabId}`);
    }
  };

  return (
    <DashboardShell
      user={me}
      tabs={tabsWithNotifications}
      activeTab="notifications"
      onTabChange={handleTabChange}
    >
      <NotificationsContent
        user={me}
        statusFilter={statusFilter}
        setStatusFilter={(s) => {
          setStatusFilter(s);
          setPage(1);
        }}
        typeFilter={typeFilter}
        setTypeFilter={(t) => {
          setTypeFilter(t);
          setPage(1);
        }}
        page={page}
        setPage={setPage}
      />
    </DashboardShell>
  );
}

interface NotificationsContentProps {
  user: User;
  statusFilter: "all" | "unread" | "read";
  setStatusFilter: (s: "all" | "unread" | "read") => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  page: number;
  setPage: (p: number) => void;
}

function NotificationsContent({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  page,
  setPage,
}: NotificationsContentProps) {
  const router = useRouter();

  const { data: countData } = useUnreadNotificationCount(15000);
  const unreadCount = countData?.unread_count ?? 0;

  const queryFilters = {
    page,
    per_page: 15,
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  };

  const {
    data: notificationsData,
    isLoading,
    isFetching,
    refetch,
  } = useNotifications(queryFilters);

  const notifications = notificationsData?.data ?? [];
  const meta = notificationsData?.meta;

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const handleNotificationClick = (n: AppNotification) => {
    if (!n.is_read) {
      markAsRead.mutate(n.id);
    }
    if (n.data?.url) {
      router.push(n.data.url);
    } else if (n.type.includes("order")) {
      router.push("/dashboard?tab=orders");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--dash-border-soft)]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="gotham text-[24px] sm:text-[28px] font-bold text-[var(--dash-text)]">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#cba660]/20 text-[#cda873] border border-[#cba660]/30 text-[12px] font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="gotham text-[14px] text-[var(--dash-text-muted)] mt-1">
            Stay updated on appointments, claims, reviews, and salon updates.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh notifications"
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] hover:border-[var(--dash-border-strong)] text-[13px] transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#cba660] hover:bg-[#cda873] text-black font-semibold text-[13px] transition-colors cursor-pointer shadow-md"
            >
              <CheckCheck size={16} />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--dash-card)] border border-[var(--dash-border)] rounded-[20px] p-3 sm:p-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--dash-bg)] rounded-xl border border-[var(--dash-border-soft)] self-start">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#cba660]/15 text-[#cda873] font-semibold"
                : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("unread")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              statusFilter === "unread"
                ? "bg-[#cba660]/15 text-[#cda873] font-semibold"
                : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="bg-[#cba660] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setStatusFilter("read")}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              statusFilter === "read"
                ? "bg-[#cba660]/15 text-[#cda873] font-semibold"
                : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
            }`}
          >
            Read
          </button>
        </div>

        {/* Type Category Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Filter size={15} className="text-[var(--dash-text-muted)]" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-xl px-3 py-1.5 text-[13px] text-[var(--dash-text)] focus:outline-none focus:border-[#cba660] transition-colors cursor-pointer"
          >
            <option value="all">All Notification Types</option>
            <option value="order">Orders & Deliveries</option>
            <option value="appointment">Appointments</option>
            <option value="service">Services</option>
            <option value="package">Packages</option>
            <option value="product">Products</option>
            <option value="shoutout">Shoutouts</option>
            <option value="review">Reviews</option>
            <option value="user">User & Account</option>
            <option value="system_alert">System Alerts</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-[var(--dash-card)] border border-[var(--dash-border)] rounded-[22px] overflow-hidden divide-y divide-[var(--dash-border-soft)] shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-[var(--dash-text-muted)]">
            <RefreshCw size={24} className="mx-auto mb-3 animate-spin opacity-50" />
            <p className="text-[14px]">Loading notifications…</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center text-[var(--dash-text-muted)]">
            <Bell size={36} className="mx-auto mb-3 opacity-30 text-[var(--dash-text)]" />
            <p className="text-[16px] font-medium text-[var(--dash-text)]">
              No notifications found
            </p>
            <p className="text-[13px] text-[var(--dash-text-muted)] mt-1 max-w-sm mx-auto">
              {statusFilter === "unread"
                ? "You've read all your notifications! Check back later for new updates."
                : "There are no notifications matching your current filters."}
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const badge = getNotificationBadge(n.type);
            const ts = formatTimestamp(n.created_at);

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`group relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 transition-colors cursor-pointer hover:bg-[var(--dash-border-soft)]/50 ${
                  !n.is_read
                    ? "bg-[#cba660]/5 border-l-4 border-l-[#cba660]"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Icon badge */}
                  <div className="p-3 rounded-2xl bg-[var(--dash-border-soft)] shrink-0 mt-0.5">
                    {badge.icon}
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#cba660] shrink-0" />
                      )}
                      <span className="text-[12px] text-[var(--dash-text-muted)]/70">
                        {ts.relative}
                      </span>
                    </div>

                    <h3
                      className={`text-[15px] leading-snug mb-1 ${
                        !n.is_read
                          ? "font-bold text-[var(--dash-text)]"
                          : "font-semibold text-[var(--dash-text)]/90"
                      }`}
                    >
                      {n.title}
                    </h3>

                    <p className="text-[13px] text-[var(--dash-text-muted)] leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="text-[11px] text-[var(--dash-text-muted)]/60">
                        {ts.full}
                      </span>

                      {n.data?.url && (
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#cda873] hover:text-[#cba660] font-medium">
                          <span>View related details</span>
                          <ArrowRight size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!n.is_read ? (
                    <button
                      onClick={() => markAsRead.mutate(n.id)}
                      disabled={markAsRead.isPending}
                      title="Mark as read"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] text-[12px] text-[var(--dash-text-muted)] hover:text-[#cba660] transition-colors cursor-pointer"
                    >
                      <Check size={13} />
                      <span>Mark read</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[var(--dash-text-muted)]/60 flex items-center gap-1 px-2">
                      <CheckCheck size={13} className="text-[#cba660]" />
                      <span>Read</span>
                    </span>
                  )}

                  <button
                    onClick={() => deleteNotification.mutate(n.id)}
                    disabled={deleteNotification.isPending}
                    title="Delete notification"
                    className="p-2 rounded-full border border-[var(--dash-border)] hover:border-red-400 text-[var(--dash-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-[13px] text-[var(--dash-text-muted)]">
          <p>
            Showing {(meta.current_page - 1) * meta.per_page + 1} to{" "}
            {Math.min(meta.current_page * meta.per_page, meta.total)} of{" "}
            {meta.total} notifications
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3.5 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[var(--dash-border-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 font-medium text-[var(--dash-text)]">
              {page} / {meta.last_page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= meta.last_page}
              className="px-3.5 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[var(--dash-border-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
