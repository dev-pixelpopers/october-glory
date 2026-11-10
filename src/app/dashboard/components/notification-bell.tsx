"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  Star,
  Sparkles,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Scissors,
  Boxes,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/lib/api/hooks/use-notifications";
import type { AppNotification } from "@/lib/api/types";

function formatRelativeTime(dateStr: string): string {
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function getNotificationIcon(type: string) {
  if (type.includes("appointment")) {
    return <Calendar size={16} className="text-[#cba660]" />;
  }
  if (type.includes("service")) {
    return <Scissors size={16} className="text-purple-400" />;
  }
  if (type.includes("package")) {
    return <Boxes size={16} className="text-blue-400" />;
  }
  if (type.includes("order")) {
    return <PackageCheck size={16} className="text-[#cba660]" />;
  }
  if (type.includes("product")) {
    return <ShoppingBag size={16} className="text-emerald-400" />;
  }
  if (type.includes("shoutout")) {
    return <Sparkles size={16} className="text-amber-400" />;
  }
  if (type.includes("review")) {
    return <Star size={16} className="text-yellow-400" />;
  }
  if (type.includes("user")) {
    return <CheckCircle2 size={16} className="text-emerald-400" />;
  }
  return <AlertCircle size={16} className="text-sky-400" />;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: countData } = useUnreadNotificationCount(15000);
  const unreadCount = countData?.unread_count ?? 0;

  const { data: notificationsData, isLoading } = useNotifications({
    per_page: 5,
  });
  const recentNotifications = notificationsData?.data ?? [];

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.is_read) {
      markAsRead.mutate(item.id);
    }
    setIsOpen(false);
    if (item.data?.url) {
      router.push(item.data.url);
    } else if (item.type.includes("order")) {
      router.push("/dashboard?tab=orders");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Notifications"
        className="relative flex items-center justify-center w-11 h-11 rounded-full border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[#cba660] hover:border-[#cba660] transition-colors cursor-pointer"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-bold bg-[#cba660] text-black rounded-full shadow-md animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[360px] sm:w-[410px] max-w-[90vw] bg-[var(--dash-card)] border border-[var(--dash-border)] shadow-2xl rounded-[20px] z-[100] overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--dash-border-soft)] bg-[var(--dash-card)]">
            <div className="flex items-center gap-2">
              <span className="gotham font-bold text-[14px] text-[var(--dash-text)] uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#cba660]/20 text-[#cda873] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="flex items-center gap-1.5 text-[12px] text-[#cda873] hover:text-[#cba660] transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of recent notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[var(--dash-border-soft)]">
            {isLoading ? (
              <div className="p-8 text-center text-[var(--dash-text-muted)] text-[13px]">
                Loading notifications…
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-[var(--dash-text-muted)]">
                <Bell size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-[14px] font-medium text-[var(--dash-text)]">
                  You&apos;re all caught up!
                </p>
                <p className="text-[12px] mt-1 text-[var(--dash-text-muted)]">
                  No notifications yet.
                </p>
              </div>
            ) : (
              recentNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group relative flex items-start gap-3 p-4 transition-colors cursor-pointer hover:bg-[var(--dash-border-soft)]/50 ${
                    !n.is_read
                      ? "bg-[#cba660]/5 border-l-2 border-[#cba660]"
                      : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0 p-2 rounded-xl bg-[var(--dash-border-soft)]">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[13px] leading-tight truncate ${
                          !n.is_read
                            ? "font-bold text-[var(--dash-text)]"
                            : "font-medium text-[var(--dash-text-muted)]"
                        }`}
                      >
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#cba660] shrink-0" />
                      )}
                    </div>
                    <p className="text-[12px] text-[var(--dash-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-[var(--dash-text-muted)]/70 mt-1.5 block">
                      {formatRelativeTime(n.created_at)}
                    </span>
                  </div>

                  {/* Actions on hover */}
                  <div
                    className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead.mutate(n.id)}
                        title="Mark as read"
                        className="p-1 rounded hover:bg-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[#cba660] transition-colors"
                      >
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification.mutate(n.id)}
                      title="Delete notification"
                      className="p-1 rounded hover:bg-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--dash-border-soft)] bg-[var(--dash-card)] text-center">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#cda873] hover:text-[#cba660] transition-colors"
            >
              <span>View all notifications</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
