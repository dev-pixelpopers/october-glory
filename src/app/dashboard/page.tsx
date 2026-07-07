import { Suspense } from "react";
import DashboardRouter from "./components/dashboard-router";

export const metadata = {
  title: "Dashboard | October Glory",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#151515] flex items-center justify-center">
          <p className="gotham text-white/60 text-[18px]">Loading…</p>
        </div>
      }
    >
      <DashboardRouter />
    </Suspense>
  );
}
