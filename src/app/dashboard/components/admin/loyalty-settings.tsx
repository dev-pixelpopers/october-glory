"use client";

import React, { useEffect, useState } from "react";
import {
  useAdjustLoyaltyPoints,
  useLoyaltySettings,
  useUpdateLoyaltySettings,
} from "@/lib/api/hooks/loyalty";
import { buttonGold, Card, inputClass } from "../dashboard-shell";

/** Conversion rate, automated reward triggers, manual grants/deductions. */
export default function LoyaltySettingsPanel() {
  const { data: settings } = useLoyaltySettings();
  const update = useUpdateLoyaltySettings();
  const adjust = useAdjustLoyaltyPoints();

  const [form, setForm] = useState({ conversion_rate: "", points_per_booking: "", shoutout_bonus_points: "" });
  const [adjustment, setAdjustment] = useState({ user_id: "", amount: "", description: "" });

  useEffect(() => {
    if (settings) {
      setForm({
        conversion_rate: settings.conversion_rate,
        points_per_booking: String(settings.points_per_booking),
        shoutout_bonus_points: String(settings.shoutout_bonus_points),
      });
    }
  }, [settings]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Loyalty Program Settings">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update.mutate({
              conversion_rate: form.conversion_rate,
              points_per_booking: Number(form.points_per_booking),
              shoutout_bonus_points: Number(form.shoutout_bonus_points),
            });
          }}
          className="flex flex-col gap-5"
        >
          <Field label="Conversion rate ($ discount per point)">
            <input className={inputClass} type="number" step="0.01" min="0" value={form.conversion_rate}
              onChange={(e) => setForm({ ...form, conversion_rate: e.target.value })} />
          </Field>
          <Field label="Points awarded per booking">
            <input className={inputClass} type="number" min="0" value={form.points_per_booking}
              onChange={(e) => setForm({ ...form, points_per_booking: e.target.value })} />
          </Field>
          <Field label="Shoutout bonus points">
            <input className={inputClass} type="number" min="0" value={form.shoutout_bonus_points}
              onChange={(e) => setForm({ ...form, shoutout_bonus_points: e.target.value })} />
          </Field>
          {update.isSuccess && <p className="gotham text-green-500 text-[14px]">Settings saved.</p>}
          {update.error && <p className="gotham text-red-400 text-[14px]">{update.error.message}</p>}
          <button type="submit" disabled={update.isPending} className={`${buttonGold} self-start`}>
            {update.isPending ? "Saving…" : "Save Settings"}
          </button>
        </form>
      </Card>

      <Card title="Manual Point Adjustment">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            adjust.mutate(
              {
                user_id: Number(adjustment.user_id),
                amount: Number(adjustment.amount),
                description: adjustment.description,
              },
              { onSuccess: () => setAdjustment({ user_id: "", amount: "", description: "" }) },
            );
          }}
          className="flex flex-col gap-5"
        >
          <Field label="Client user ID">
            <input className={inputClass} type="number" min="1" value={adjustment.user_id} required
              onChange={(e) => setAdjustment({ ...adjustment, user_id: e.target.value })} />
          </Field>
          <Field label="Points (negative to deduct)">
            <input className={inputClass} type="number" value={adjustment.amount} required
              onChange={(e) => setAdjustment({ ...adjustment, amount: e.target.value })} />
          </Field>
          <Field label="Reason (appears in the client's ledger)">
            <input className={inputClass} value={adjustment.description} required
              onChange={(e) => setAdjustment({ ...adjustment, description: e.target.value })} />
          </Field>
          {adjust.isSuccess && <p className="gotham text-green-500 text-[14px]">Adjustment recorded.</p>}
          {adjust.error && <p className="gotham text-red-400 text-[14px]">{adjust.error.message}</p>}
          <button type="submit" disabled={adjust.isPending} className={`${buttonGold} self-start`}>
            {adjust.isPending ? "Applying…" : "Apply Adjustment"}
          </button>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="gotham text-[var(--dash-text-muted)] text-[13px] uppercase tracking-widest">{label}</span>
      {children}
    </label>
  );
}
