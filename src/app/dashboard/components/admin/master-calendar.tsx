"use client";

import React, { useState } from "react";
import {
  useAppointments,
  useCancelAppointment,
  useRescheduleAppointment,
} from "@/lib/api/hooks/booking";
import { useWorkers } from "@/lib/api/hooks/catalog";
import type { Appointment, AppointmentStatus } from "@/lib/api/types";
import { money, shortDate, timeLabel } from "@/lib/format";
import { buttonGhost, buttonGold, Card, inputClass, StatusBadge } from "../dashboard-shell";
import { Modal } from "./service-manager";
import { Pagination } from "./audit-log-viewer";

const STATUSES: AppointmentStatus[] = [
  "scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show",
];

/** Master booking table: filter by range/worker/status, cancel & reschedule. */
export default function MasterCalendar() {
  const [filters, setFilters] = useState({
    from: "", to: "", worker_id: "", status: "", page: 1,
  });
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);

  const { data: workers } = useWorkers();
  const { data, isLoading } = useAppointments({
    from: filters.from || undefined,
    to: filters.to || undefined,
    worker_id: filters.worker_id ? Number(filters.worker_id) : undefined,
    status: (filters.status || undefined) as AppointmentStatus | undefined,
    page: filters.page,
  });
  const cancel = useCancelAppointment();

  const set = (patch: Partial<typeof filters>) => setFilters({ ...filters, page: 1, ...patch });

  return (
    <>
      <Card title="Master Calendar">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <input type="date" className={inputClass} value={filters.from} onChange={(e) => set({ from: e.target.value })} />
          <input type="date" className={inputClass} value={filters.to} onChange={(e) => set({ to: e.target.value })} />
          <select className={inputClass} value={filters.worker_id} onChange={(e) => set({ worker_id: e.target.value })}>
            <option value="">All specialists</option>
            {(workers ?? []).map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <select className={inputClass} value={filters.status} onChange={(e) => set({ status: e.target.value })}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading appointments…</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--dash-border)]">
                {["Ref", "Date & Time", "Client", "Specialist", "Services", "Total", "Status", ""].map((h) => (
                  <th key={h} className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest py-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dash-border-soft)]">
              {(data?.data ?? []).map((a) => (
                <tr key={a.id}>
                  <td className="gotham text-[#cda873] text-[14px] py-4 pr-4">{a.booking_reference}</td>
                  <td className="gotham text-[var(--dash-text)] text-[14px] pr-4 whitespace-nowrap">
                    {shortDate(a.start_time)}
                    <span className="text-[var(--dash-text-muted)]"> · {timeLabel(a.start_time)}</span>
                  </td>
                  <td className="gotham text-[var(--dash-text-soft)] text-[14px] pr-4">{a.client?.name}</td>
                  <td className="gotham text-[var(--dash-text-soft)] text-[14px] pr-4">{a.worker?.name}</td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[13px] pr-4 max-w-[220px]">
                    {a.services.map((s) => s.service_name).join(", ")}
                  </td>
                  <td className="gotham font-bold text-[var(--dash-text)] text-[14px] pr-4">{money(a.total_amount)}</td>
                  <td className="pr-4"><StatusBadge status={a.status} /></td>
                  <td className="py-3">
                    {a.status === "scheduled" && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setRescheduling(a)}
                          className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-[#cda873] px-3 py-1.5 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => cancel.mutate(a.id)}
                          className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-red-400 px-3 py-1.5 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.meta.last_page > 1 && (
          <Pagination
            page={data.meta.current_page}
            lastPage={data.meta.last_page}
            onChange={(p) => setFilters({ ...filters, page: p })}
          />
        )}
      </Card>

      {rescheduling && (
        <RescheduleModal appointment={rescheduling} onClose={() => setRescheduling(null)} />
      )}
    </>
  );
}

function RescheduleModal({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const reschedule = useRescheduleAppointment();
  const [datetime, setDatetime] = useState("");

  return (
    <Modal title={`Reschedule — ${appointment.booking_reference}`} onClose={onClose}>
      <p className="gotham text-[var(--dash-text-muted)] text-[15px] mb-4">
        {appointment.client?.name} with {appointment.worker?.name} · currently{" "}
        {shortDate(appointment.start_time)} at {timeLabel(appointment.start_time)}
      </p>
      <input
        type="datetime-local"
        className={inputClass}
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
      />
      {reschedule.error && (
        <p className="gotham text-red-400 text-[14px] mt-3">{reschedule.error.message}</p>
      )}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className={buttonGhost}>Cancel</button>
        <button
          disabled={!datetime || reschedule.isPending}
          onClick={() =>
            reschedule.mutate(
              { id: appointment.id, start_time: datetime },
              { onSuccess: onClose },
            )
          }
          className={buttonGold}
        >
          {reschedule.isPending ? "Moving…" : "Confirm New Time"}
        </button>
      </div>
    </Modal>
  );
}
