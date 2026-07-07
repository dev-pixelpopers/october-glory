"use client";

import React, { useMemo, useState } from "react";
import { CalendarDays, Star } from "lucide-react";
import { useAppointments, useUpdateAppointmentStatus } from "@/lib/api/hooks/booking";
import { useWorkerMetrics } from "@/lib/api/hooks/reviews";
import type { Appointment, AppointmentStatus, User } from "@/lib/api/types";
import { durationLabel, shortDate, timeLabel, toDateKey } from "@/lib/format";
import DashboardShell, { Card, StatusBadge } from "../dashboard-shell";

const NEXT_ACTIONS: Partial<Record<AppointmentStatus, { to: AppointmentStatus; label: string }[]>> = {
  scheduled: [
    { to: "checked_in", label: "Check In" },
    { to: "no_show", label: "No-Show" },
  ],
  checked_in: [{ to: "in_progress", label: "Start Session" }],
  in_progress: [{ to: "completed", label: "Complete" }],
};

export default function WorkerDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState("schedule");

  return (
    <DashboardShell
      user={user}
      tabs={[
        { id: "schedule", label: "My Schedule", icon: CalendarDays },
        { id: "performance", label: "My Performance", icon: Star },
      ]}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === "schedule" && <ScheduleView />}
      {tab === "performance" && <PerformanceView />}
    </DashboardShell>
  );
}

/* ------------------------------ Schedule ------------------------------------ */

function ScheduleView() {
  const [mode, setMode] = useState<"day" | "week">("day");
  const [anchor, setAnchor] = useState(() => new Date());
  const updateStatus = useUpdateAppointmentStatus();

  const range = useMemo(() => {
    const from = new Date(anchor);
    const to = new Date(anchor);
    if (mode === "week") {
      from.setDate(from.getDate() - from.getDay());
      to.setDate(from.getDate() + 6);
    }
    return { from: toDateKey(from), to: toDateKey(to) };
  }, [anchor, mode]);

  const { data, isLoading } = useAppointments({ from: range.from, to: range.to });

  const shift = (dir: 1 | -1) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + dir * (mode === "week" ? 7 : 1));
    setAnchor(d);
  };

  const appointments = [...(data?.data ?? [])].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );

  return (
    <Card
      title={mode === "day" ? shortDate(anchor.toISOString()) : `Week of ${shortDate(range.from)}`}
      action={
        <div className="flex items-center gap-2">
          {(["day", "week"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`gotham text-[12px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                mode === m ? "bg-[#cba660] text-black font-bold" : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
              }`}
            >
              {m}
            </button>
          ))}
          <button onClick={() => shift(-1)} className="text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] px-2 cursor-pointer">←</button>
          <button onClick={() => shift(1)} className="text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] px-2 cursor-pointer">→</button>
        </div>
      }
    >
      {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading schedule…</p>}
      {!isLoading && appointments.length === 0 && (
        <p className="gotham text-[var(--dash-text-faint)] text-[15px]">No appointments in this window.</p>
      )}

      <div className="flex flex-col gap-4">
        {appointments.map((a: Appointment) => (
          <div key={a.id} className="border border-[var(--dash-border)] rounded-[18px] p-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="w-[130px] shrink-0">
              <p className="gotham font-bold text-[#cda873] text-[18px]">{timeLabel(a.start_time)}</p>
              <p className="gotham text-[var(--dash-text-muted)] text-[13px]">
                {mode === "week" && `${shortDate(a.start_time)} · `}
                {durationLabel(a.total_duration_minutes)}
              </p>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="gotham font-bold text-[var(--dash-text)] text-[16px]">{a.client?.name}</p>
              <p className="gotham text-[var(--dash-text-muted)] text-[14px]">
                {a.services.map((s) => s.service_name).join(", ")}
              </p>
              {a.notes && <p className="gotham text-[var(--dash-text-faint)] text-[13px] italic mt-1">“{a.notes}”</p>}
            </div>
            <StatusBadge status={a.status} />
            <div className="flex gap-2">
              {(NEXT_ACTIONS[a.status] ?? []).map((action) => (
                <button
                  key={action.to}
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: a.id, status: action.to })}
                  className={`gotham text-[13px] px-4 py-2 rounded-full transition-colors cursor-pointer ${
                    action.to === "no_show"
                      ? "text-red-400 border border-red-400/40 hover:bg-red-400/10"
                      : "bg-[#cba660] hover:bg-[#b8934e] text-black font-bold"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ----------------------------- Performance ---------------------------------- */

function PerformanceView() {
  const { data, isLoading } = useWorkerMetrics();

  if (isLoading) return <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading metrics…</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Overall Rating" className="lg:col-span-1 text-center">
        <p className="andrea text-[#cda873] text-[84px] leading-none">
          {data?.rating_average?.toFixed(1) ?? "—"}
        </p>
        <p className="text-[#cba660] text-[24px] mt-2 tracking-[0.3em]">
          {"★".repeat(Math.round(data?.rating_average ?? 0))}
          <span className="text-[var(--dash-text-faint)]">{"★".repeat(5 - Math.round(data?.rating_average ?? 0))}</span>
        </p>
        <p className="gotham text-[var(--dash-text-muted)] text-[14px] mt-3">
          from {data?.reviews_count ?? 0} client review{data?.reviews_count === 1 ? "" : "s"}
        </p>
      </Card>

      <Card title="Client Feedback" className="lg:col-span-2">
        {(data?.reviews ?? []).length === 0 && (
          <p className="gotham text-[var(--dash-text-faint)] text-[15px]">No reviews yet — they&apos;ll appear here.</p>
        )}
        <div className="flex flex-col divide-y divide-[var(--dash-border-soft)]">
          {(data?.reviews ?? []).map((r) => (
            <div key={r.id} className="py-4">
              <div className="flex items-center gap-3">
                <span className="text-[#cba660] text-[15px]">
                  {"★".repeat(r.rating)}
                  <span className="text-[var(--dash-text-faint)]">{"★".repeat(5 - r.rating)}</span>
                </span>
                <span className="gotham text-[var(--dash-text-soft)] text-[14px]">{r.client?.name}</span>
                <span className="gotham text-[var(--dash-text-faint)] text-[13px] ml-auto">{shortDate(r.created_at)}</span>
              </div>
              {r.comment && (
                <p className="gotham font-light text-[var(--dash-text-soft)] text-[15px] mt-2 leading-relaxed">
                  “{r.comment}”
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
