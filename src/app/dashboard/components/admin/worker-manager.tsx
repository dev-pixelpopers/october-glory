"use client";

import React, { useState } from "react";
import {
  useCreateWorker,
  useServices,
  useUpdateWorker,
  useWorkers,
  type WorkerPayload,
} from "@/lib/api/hooks/catalog";
import type { Worker } from "@/lib/api/types";
import { buttonGhost, buttonGold, Card, inputClass } from "../dashboard-shell";
import { Modal } from "./service-manager";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type ScheduleRow = { day_of_week: number; start_time: string; end_time: string; is_day_off: boolean };

const defaultSchedules: ScheduleRow[] = DAYS.map((_, day) => ({
  day_of_week: day,
  start_time: "09:00",
  end_time: "19:00",
  is_day_off: day === 0 || day === 1,
}));

/** Admin worker management: account, weekly hours, qualified services. */
export default function WorkerManager() {
  const { data: workers } = useWorkers();
  const [editing, setEditing] = useState<Worker | "new" | null>(null);

  return (
    <>
      <Card
        title="Specialists"
        action={
          <button className={buttonGold} onClick={() => setEditing("new")}>
            + Add Worker
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(workers ?? []).map((w) => (
            <div key={w.id} className="border border-[var(--dash-border)] rounded-[18px] p-6">
              <div className="flex items-center gap-4">
                {w.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.avatar_url} alt={w.name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-[#9C6D51] to-[#5F3A21] text-[var(--dash-text)] andrea text-[22px]">
                    {w.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="gotham font-bold text-[var(--dash-text)] text-[17px]">{w.name}</p>
                  <p className={`gotham text-[13px] ${w.is_active ? "text-green-500" : "text-[var(--dash-text-faint)]"}`}>
                    {w.is_active ? "Active" : "Inactive"}
                    {w.rating_average != null && (
                      <span className="text-[#cda873]"> · ★ {w.rating_average.toFixed(1)}</span>
                    )}
                  </p>
                </div>
              </div>
              {w.profile.specialties && w.profile.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {w.profile.specialties.map((s) => (
                    <span key={s} className="gotham text-[12px] text-[var(--dash-text-muted)] border border-[var(--dash-border)] rounded-full px-3 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <p className="gotham text-[var(--dash-text-faint)] text-[13px] mt-3">
                {w.service_ids?.length ?? 0} qualified services
              </p>
              <button onClick={() => setEditing(w)} className={`${buttonGhost} mt-4 w-full text-center`}>
                Edit Worker
              </button>
            </div>
          ))}
        </div>
      </Card>

      {editing && (
        <WorkerFormModal worker={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

function WorkerFormModal({ worker, onClose }: { worker: Worker | null; onClose: () => void }) {
  const { data: services } = useServices();
  const create = useCreateWorker();
  const update = useUpdateWorker();

  const [form, setForm] = useState<WorkerPayload>({
    name: worker?.name ?? "",
    email: "",
    password: "",
    avatar_url: worker?.avatar_url ?? "",
    bio: worker?.profile.bio ?? "",
    specialties: worker?.profile.specialties ?? [],
    is_active: worker?.is_active ?? true,
    service_ids: worker?.service_ids ?? [],
    schedules:
      worker?.schedules?.map((s) => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        is_day_off: s.is_day_off,
      })) ?? defaultSchedules,
  });
  const [specialtiesText, setSpecialtiesText] = useState((worker?.profile.specialties ?? []).join(", "));

  const pending = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: WorkerPayload = {
      ...form,
      specialties: specialtiesText.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (!payload.password) delete payload.password;
    if (!payload.avatar_url) delete payload.avatar_url;
    if (worker) {
      // Email/password only sent when changed.
      const { email, ...rest } = payload;
      update.mutate({ id: worker.id, ...(email ? payload : rest) }, { onSuccess: onClose });
    } else {
      create.mutate(payload, { onSuccess: onClose });
    }
  };

  const setSchedule = (day: number, patch: Partial<ScheduleRow>) =>
    setForm({
      ...form,
      schedules: form.schedules!.map((s) => (s.day_of_week === day ? { ...s, ...patch } : s)),
    });

  const toggleService = (id: number) =>
    setForm({
      ...form,
      service_ids: form.service_ids!.includes(id)
        ? form.service_ids!.filter((s) => s !== id)
        : [...form.service_ids!, id],
    });

  return (
    <Modal title={worker ? `Edit — ${worker.name}` : "Add Worker"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input className={inputClass} placeholder="Full name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <input className={inputClass} type="email" placeholder={worker ? "New email (optional)" : "Email"}
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required={!worker} />
          <input className={inputClass} type="password" placeholder={worker ? "New password (optional)" : "Password"}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!worker} />
        </div>
        <input className={inputClass} placeholder="Avatar URL" value={form.avatar_url}
          onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
        <textarea className={inputClass} placeholder="Bio" rows={2} value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <input className={inputClass} placeholder="Specialties (comma separated)" value={specialtiesText}
          onChange={(e) => setSpecialtiesText(e.target.value)} />

        <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="accent-[#cba660] w-5 h-5" />
          Active
        </label>

        {/* Weekly hours */}
        <div>
          <p className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest mb-3">Weekly Hours</p>
          <div className="flex flex-col gap-2">
            {form.schedules!.map((row) => (
              <div key={row.day_of_week} className="flex items-center gap-3">
                <span className="gotham text-[var(--dash-text-soft)] text-[14px] w-[92px]">{DAYS[row.day_of_week]}</span>
                <input type="time" className={`${inputClass} !w-auto !py-1.5`} value={row.start_time}
                  disabled={row.is_day_off}
                  onChange={(e) => setSchedule(row.day_of_week, { start_time: e.target.value })} />
                <span className="text-[var(--dash-text-faint)]">–</span>
                <input type="time" className={`${inputClass} !w-auto !py-1.5`} value={row.end_time}
                  disabled={row.is_day_off}
                  onChange={(e) => setSchedule(row.day_of_week, { end_time: e.target.value })} />
                <label className="flex items-center gap-2 gotham text-[var(--dash-text-muted)] text-[13px] cursor-pointer ml-auto">
                  <input type="checkbox" checked={row.is_day_off}
                    onChange={(e) => setSchedule(row.day_of_week, { is_day_off: e.target.checked })}
                    className="accent-[#cba660] w-4 h-4" />
                  Day off
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Qualified services */}
        <div>
          <p className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest mb-3">Qualified Services</p>
          <div className="flex flex-wrap gap-2">
            {(services ?? []).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleService(s.id)}
                className={`gotham text-[13px] px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  form.service_ids!.includes(s.id)
                    ? "bg-[#cba660]/15 border-[#cba660] text-[#cda873]"
                    : "border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:border-[var(--dash-border-strong)]"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="gotham text-red-400 text-[14px]">{error.message}</p>}
        <div className="flex justify-end gap-3 mt-2">
          <button type="button" onClick={onClose} className={buttonGhost}>Cancel</button>
          <button type="submit" disabled={pending} className={buttonGold}>
            {pending ? "Saving…" : "Save Worker"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
