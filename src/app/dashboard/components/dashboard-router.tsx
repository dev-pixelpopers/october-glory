"use client";

import React from "react";
import AuthGate from "@/app/components/salon/auth-gate";
import { useMe } from "@/lib/api/hooks/auth";
import AdminDashboard from "./admin/admin-dashboard";
import ClientDashboard from "./client/client-dashboard";
import WorkerDashboard from "./worker/worker-dashboard";

/** Routes the signed-in user to their role's dashboard. */
export default function DashboardRouter() {
  return (
    <div className="min-h-screen bg-[#151515]">
      <AuthGate>
        <RoleSwitch />
      </AuthGate>
    </div>
  );
}

function RoleSwitch() {
  const { data: me } = useMe();

  if (!me) return null;
  if (me.role === "admin") return <AdminDashboard user={me} />;
  if (me.role === "worker") return <WorkerDashboard user={me} />;
  return <ClientDashboard user={me} />;
}
