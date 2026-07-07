"use client";

import React, { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Gift,
  Megaphone,
  Scissors,
  ScrollText,
  Users,
} from "lucide-react";
import type { User } from "@/lib/api/types";
import DashboardShell from "../dashboard-shell";
import AnalyticsCharts from "./analytics-charts";
import AuditLogViewer from "./audit-log-viewer";
import LoyaltySettingsPanel from "./loyalty-settings";
import MasterCalendar from "./master-calendar";
import ServiceManager from "./service-manager";
import ShoutoutQueue from "./shoutout-queue";
import WorkerManager from "./worker-manager";

export default function AdminDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState("analytics");

  return (
    <DashboardShell
      user={user}
      tabs={[
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "calendar", label: "Master Calendar", icon: CalendarDays },
        { id: "services", label: "Services & Pricing", icon: Scissors },
        { id: "workers", label: "Workers", icon: Users },
        { id: "loyalty", label: "Loyalty Settings", icon: Gift },
        { id: "shoutouts", label: "Shoutout Queue", icon: Megaphone },
        { id: "audit", label: "Audit Log", icon: ScrollText },
      ]}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === "analytics" && <AnalyticsCharts />}
      {tab === "calendar" && <MasterCalendar />}
      {tab === "services" && <ServiceManager />}
      {tab === "workers" && <WorkerManager />}
      {tab === "loyalty" && <LoyaltySettingsPanel />}
      {tab === "shoutouts" && <ShoutoutQueue />}
      {tab === "audit" && <AuditLogViewer />}
    </DashboardShell>
  );
}
