"use client";

import React from "react";
import { redirect, useRouter } from "next/navigation";
import AuthGate from "@/app/components/salon/auth-gate";
import { useMe } from "@/lib/api/hooks/auth";
import DashboardShell from "../components/dashboard-shell";
import { CLIENT_NAV } from "../components/client/client-dashboard";
import BookingWizard from "./components/booking-wizard";

/**
 * Booking wizard inside the authenticated dashboard chrome (sidebar,
 * header, theme toggle). Anonymous visitors get the sign-in / guest panel
 * from AuthGate first; staff are sent to their own dashboard views.
 */
export default function BookScreen() {
  return (
    <div className="min-h-screen bg-[#151515]">
      <AuthGate>
        <BookShell />
      </AuthGate>
    </div>
  );
}

function BookShell() {
  const { data: me } = useMe();
  const router = useRouter();

  if (!me) return null;
  if (me.role !== "client") redirect("/dashboard");

  return (
    <DashboardShell
      user={me}
      tabs={CLIENT_NAV}
      activeTab="book"
      onTabChange={(id) => {
        if (id !== "book") router.push(`/dashboard?tab=${id}`);
      }}
    >
      {/* The wizard is styled for the brand's dark canvas; keep that canvas
          as a card so it reads correctly in the light dashboard theme too. */}
      <div className="bg-[#151515] rounded-[22px] pt-12 pb-6 overflow-hidden">
        <BookingWizard />
      </div>
    </DashboardShell>
  );
}
