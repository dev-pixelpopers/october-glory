"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X, type LucideIcon } from "lucide-react";
import { useLogout } from "@/lib/api/hooks/auth";
import type { User } from "@/lib/api/types";
import { DashThemeProvider, ThemeToggle } from "./theme";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface Props {
  user: User;
  tabs: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

/**
 * Shared chrome for all role dashboards: collapsible sidebar (icon rail on
 * desktop, slide-over sheet under 1024px), scoped light/dark theme toggle,
 * and a sign-out that always lands the user on /login.
 */
export default function DashboardShell(props: Props) {
  return (
    <DashThemeProvider>
      <ShellInner {...props} />
    </DashThemeProvider>
  );
}

function ShellInner({ user, tabs, activeTab, onTabChange, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useLogout();
  const router = useRouter();

  const signOut = () => {
    // Redirect regardless of the API result: even if the token was already
    // invalidated (second click → 401), local state is cleared and the user
    // must not remain on the protected dashboard.
    logout.mutate(undefined, {
      onSettled: () => router.replace("/login"),
    });
  };

  const nav = (isMobile: boolean) => (
    <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              setMobileOpen(false);
            }}
            title={collapsed && !isMobile ? tab.label : undefined}
            className={`flex items-center gap-3 rounded-[14px] px-3 py-3 transition-colors cursor-pointer ${
              active
                ? "bg-[#cba660]/15 text-[#cda873]"
                : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-border-soft)]"
            } ${collapsed && !isMobile ? "justify-center" : ""}`}
          >
            <Icon size={20} className="shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="gotham text-[15px] whitespace-nowrap">{tab.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const sidebarHeader = (isMobile: boolean) => (
    <div className={`flex items-center h-[72px] px-4 border-b border-[var(--dash-border-soft)] ${collapsed && !isMobile ? "justify-center" : "justify-between"}`}>
      {(!collapsed || isMobile) && (
        <Link href="/" className="w-[120px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.svg"
            alt="October Glory"
            className="object-contain dash-logo"
          />
        </Link>
      )}
      {isMobile ? (
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] cursor-pointer"
        >
          <X size={22} />
        </button>
      ) : (
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-[var(--dash-text-muted)] hover:text-[#cba660] transition-colors cursor-pointer"
        >
          {collapsed ? <PanelLeftOpen size={21} /> : <PanelLeftClose size={21} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar: w-64 ↔ w-16 icon rail */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen bg-[var(--dash-card)] border-r border-[var(--dash-border-soft)] transition-[width] duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarHeader(false)}
        {nav(false)}
      </aside>

      {/* Mobile slide-over sheet */}
      <div className={`lg:hidden fixed inset-0 z-[90] ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 flex flex-col bg-[var(--dash-card)] border-r border-[var(--dash-border-soft)] shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarHeader(true)}
          {nav(true)}
        </aside>
      </div>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-[80] h-[72px] flex items-center gap-4 px-5 md:px-8 bg-[var(--dash-card)]/95 backdrop-blur border-b border-[var(--dash-border-soft)]">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] cursor-pointer"
          >
            <Menu size={24} />
          </button>

          <p className="gotham font-bold text-[var(--dash-text)] text-[17px] truncate">
            {tabs.find((t) => t.id === activeTab)?.label}
          </p>

          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right hidden md:block">
              <p className="gotham font-bold text-[var(--dash-text)] text-[15px] leading-tight">{user.name}</p>
              <p className="gotham text-[#cda873] text-[12px] uppercase tracking-widest">{user.role}</p>
            </div>
            <button
              onClick={signOut}
              disabled={logout.isPending}
              className="flex items-center gap-2 gotham text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] text-[14px] px-4 py-2.5 rounded-full border border-[var(--dash-border)] hover:border-[var(--dash-border-strong)] transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{logout.isPending ? "Signing out…" : "Sign Out"}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 md:px-8 py-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

/* Shared primitives used across dashboard panels. */

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[var(--dash-card)] border border-[var(--dash-border)] rounded-[22px] p-7 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="gotham font-bold text-[#cba660] text-[14px] uppercase tracking-[0.25em]">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    scheduled: "bg-[#cba660]/15 text-[#cda873] border-[#cba660]/40",
    checked_in: "bg-blue-400/10 text-blue-400 border-blue-400/30",
    in_progress: "bg-purple-400/10 text-purple-400 border-purple-400/30",
    completed: "bg-green-500/10 text-green-500 border-green-500/30",
    cancelled: "bg-[var(--dash-border-soft)] text-[var(--dash-text-faint)] border-[var(--dash-border)]",
    no_show: "bg-red-400/10 text-red-400 border-red-400/30",
    pending: "bg-[#cba660]/15 text-[#cda873] border-[#cba660]/40",
    approved: "bg-green-500/10 text-green-500 border-green-500/30",
    rejected: "bg-red-400/10 text-red-400 border-red-400/30",
    paid: "bg-green-500/10 text-green-500 border-green-500/30",
  };
  return (
    <span
      className={`gotham text-[12px] uppercase tracking-wider px-3 py-1 rounded-full border ${styles[status] ?? "bg-[var(--dash-border-soft)] text-[var(--dash-text-muted)] border-[var(--dash-border)]"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export const inputClass =
  "w-full bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-[14px] px-4 py-3 text-[var(--dash-text)] gotham text-[15px] placeholder:text-[var(--dash-text-faint)] focus:border-[#cba660] focus:outline-none transition-colors";

export const buttonGold =
  "bg-[#cba660] hover:bg-[#b8934e] disabled:opacity-40 text-black gotham font-bold text-[15px] px-6 py-3 rounded-full transition-colors cursor-pointer";

export const buttonGhost =
  "border border-[var(--dash-border)] hover:border-[var(--dash-border-strong)] text-[var(--dash-text-soft)] hover:text-[var(--dash-text)] gotham text-[15px] px-6 py-3 rounded-full transition-colors cursor-pointer";
