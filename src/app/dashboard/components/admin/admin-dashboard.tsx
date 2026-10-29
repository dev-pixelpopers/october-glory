"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Boxes,
  CalendarDays,
  Crown,
  Gift,
  Megaphone,
  Scissors,
  ScrollText,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { User } from "@/lib/api/types";
import DashboardShell from "../dashboard-shell";
import AnalyticsCharts from "./analytics-charts";
import AuditLogViewer from "./audit-log-viewer";
import LoyaltySettingsPanel from "./loyalty-settings";
import CategoryManager from "./category-manager";
import ClientManager from "./client-manager";
import MasterCalendar from "./master-calendar";
import PackageManager from "./package-manager";
import ProductManager from "./product-manager";
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
        { id: "packages", label: "Packages", icon: Boxes },
        { id: "products", label: "Products", icon: ShoppingBag },
        { id: "workers", label: "Workers", icon: Users },
        { id: "clients", label: "Clients & Members", icon: Crown },
        { id: "loyalty", label: "Loyalty Settings", icon: Gift },
        { id: "shoutouts", label: "Shoutout Queue", icon: Megaphone },
        { id: "audit", label: "Audit Log", icon: ScrollText },
      ]}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === "analytics" && <AnalyticsCharts />}
      {tab === "calendar" && <MasterCalendar />}
      {tab === "services" && (
        <div className="flex flex-col gap-6">
          <CategoryManager />
          <ServiceManager />
        </div>
      )}
      {tab === "packages" && <PackageManager />}
      {tab === "products" && <ProductManager />}
      {tab === "workers" && <WorkerManager />}
      {tab === "clients" && <ClientManager />}
      {tab === "loyalty" && <LoyaltySettingsPanel />}
      {tab === "shoutouts" && <ShoutoutQueue />}
      {tab === "audit" && <AuditLogViewer />}
    </DashboardShell>
  );
}
