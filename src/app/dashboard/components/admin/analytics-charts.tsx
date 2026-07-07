"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useAppointmentVolume,
  useLoyaltyEconomy,
  useRevenueAnalytics,
  useWorkerUtilization,
} from "@/lib/api/hooks/admin";
import type { RevenueGranularity } from "@/lib/api/types";
import { Card } from "../dashboard-shell";

const GOLD = "#cba660";
const GOLD_LIGHT = "#cda873";
const BRONZE = "#9C6D51";
// SVG + inline styles both resolve CSS variables, so the charts follow the
// dashboard-scoped theme without re-rendering logic.
const MUTED = "var(--dash-text-muted)";

const tooltipStyle = {
  backgroundColor: "var(--dash-card)",
  border: "1px solid rgba(203,166,96,0.4)",
  borderRadius: 12,
  fontFamily: "Gotham, sans-serif",
  fontSize: 13,
  color: "var(--dash-text)",
};

const axisProps = {
  stroke: MUTED,
  tick: { fill: MUTED, fontSize: 12, fontFamily: "Gotham, sans-serif" },
  axisLine: { stroke: "var(--dash-border)" },
  tickLine: false as const,
};

export default function AnalyticsCharts() {
  const [granularity, setGranularity] = useState<RevenueGranularity>("daily");
  const revenue = useRevenueAnalytics(granularity);
  const volume = useAppointmentVolume();
  const utilization = useWorkerUtilization();
  const economy = useLoyaltyEconomy();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Revenue over time */}
      <Card
        title="Revenue Over Time"
        action={
          <div className="flex gap-1">
            {(["daily", "weekly", "monthly", "yearly"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`gotham text-[12px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  granularity === g
                    ? "bg-[#cba660] text-black font-bold"
                    : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenue.data ?? []}>
            <defs>
              <linearGradient id="revGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border-soft)" />
            <XAxis dataKey="period" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `$${v}`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}`, "Revenue"]} />
            <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#revGold)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Appointment volume & status */}
      <Card title="Appointment Volume & Status">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={volume.data ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border-soft)" />
            <XAxis dataKey="period" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--dash-border-soft)" }} />
            <Legend wrapperStyle={{ fontFamily: "Gotham, sans-serif", fontSize: 13 }} />
            <Bar dataKey="completed" name="Completed" fill={GOLD} radius={[6, 6, 0, 0]} />
            <Bar dataKey="cancelled" name="Cancelled" fill={MUTED} radius={[6, 6, 0, 0]} />
            <Bar dataKey="no_show" name="No-Show" fill={BRONZE} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Worker utilization */}
      <Card title="Worker Utilization (Last 30 Days)">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={utilization.data ?? []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border-soft)" />
            <XAxis type="number" domain={[0, 100]} {...axisProps} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="worker_name" width={130} {...axisProps} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "var(--dash-border-soft)" }}
              formatter={(v, _name, item) => {
                const p = item?.payload as { booked_hours?: number; available_hours?: number } | undefined;
                return [`${v}% (${p?.booked_hours ?? 0}h of ${p?.available_hours ?? 0}h)`, "Utilization"];
              }}
            />
            <Bar dataKey="utilization_pct" fill={GOLD_LIGHT} radius={[0, 6, 6, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Loyalty economy */}
      <Card title="Loyalty Points Economy">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={economy.data ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border-soft)" />
            <XAxis dataKey="period" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontFamily: "Gotham, sans-serif", fontSize: 13 }} />
            <Line type="monotone" dataKey="issued" name="Issued" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD }} />
            <Line type="monotone" dataKey="redeemed" name="Redeemed" stroke={BRONZE} strokeWidth={2} dot={{ fill: BRONZE }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
