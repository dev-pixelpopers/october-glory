"use client";

import React, { useMemo, useState } from "react";
import CheckoutGate from "./checkout-gate";
import { useCreateAppointment } from "@/lib/api/hooks/booking";
import { useLoyaltyBalance } from "@/lib/api/hooks/loyalty";
import type {
  Appointment,
  AvailabilitySlot,
  PaymentMethod,
  Service,
} from "@/lib/api/types";
import { dateLabel, durationLabel, money, timeLabel } from "@/lib/format";

interface Props {
  services: Service[];
  slot: AvailabilitySlot;
  subtotal: number;
  totalDuration: number;
  workerId: number | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  pointsUsed: number;
  onPointsChange: (points: number) => void;
  onConfirmed: (appointment: Appointment) => void;
}

export default function StepCheckout(props: Props) {
  return (
    <CheckoutGate>
      <CheckoutInner {...props} />
    </CheckoutGate>
  );
}

function CheckoutInner({
  services,
  slot,
  subtotal,
  totalDuration,
  workerId,
  paymentMethod,
  onPaymentMethodChange,
  pointsUsed,
  onPointsChange,
  onConfirmed,
}: Props) {
  const { data: loyalty } = useLoyaltyBalance();
  const createAppointment = useCreateAppointment();
  const [notes, setNotes] = useState("");

  const rate = parseFloat(loyalty?.conversion_rate ?? "0");
  const maxRedeemable = useMemo(() => {
    if (!loyalty || rate <= 0) return 0;
    // Can't discount below zero.
    return Math.min(loyalty.balance, Math.floor(subtotal / rate));
  }, [loyalty, rate, subtotal]);

  const discount = pointsUsed * rate;
  const total = Math.max(0, subtotal - discount);

  const confirm = () => {
    createAppointment.mutate(
      {
        service_ids: services.map((s) => s.id),
        worker_id: workerId ?? slot.worker_id,
        start_time: slot.start,
        payment_method: paymentMethod,
        loyalty_points_used: pointsUsed,
        notes: notes || undefined,
      },
      { onSuccess: onConfirmed },
    );
  };

  return (
    <div className="max-w-[720px] mx-auto">
      <h2 className="andrea text-white text-[64px] text-center leading-none">Checkout</h2>
      <p className="valturin text-[#cda873] text-[30px] text-center mt-2 mb-12">
        One last look before we make it official.
      </p>

      {/* Order summary */}
      <div className="bg-[#1d1d1d] border border-white/15 rounded-[22px] p-8 mb-6">
        <h3 className="gotham font-bold text-[#cba660] text-[14px] uppercase tracking-[0.25em] mb-5">
          Your Appointment
        </h3>
        <p className="gotham text-white text-[18px]">
          {dateLabel(slot.start)} at {timeLabel(slot.start)}
        </p>
        <p className="gotham text-white/60 text-[15px] mt-1">
          with {slot.worker_name} · {durationLabel(totalDuration)}
        </p>

        <div className="border-t border-white/10 mt-6 pt-5 flex flex-col gap-3">
          {services.map((s) => (
            <div key={s.id} className="flex justify-between">
              <span className="gotham text-white/80 text-[16px]">{s.name}</span>
              <span className="gotham text-white text-[16px]">{money(s.current_price)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-white/10 pt-3">
            <span className="gotham text-white/60 text-[16px]">Subtotal</span>
            <span className="gotham text-white text-[16px]">{money(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="gotham text-[#cda873] text-[16px]">
                Loyalty discount ({pointsUsed} pts)
              </span>
              <span className="gotham text-[#cda873] text-[16px]">−{money(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="gotham font-bold text-white text-[20px]">Total</span>
            <span className="gotham font-bold text-[#cda873] text-[20px]">{money(total)}</span>
          </div>
        </div>
      </div>

      {/* Loyalty redemption */}
      <div className="bg-[#1d1d1d] border border-white/15 rounded-[22px] p-8 mb-6">
        <h3 className="gotham font-bold text-[#cba660] text-[14px] uppercase tracking-[0.25em] mb-2">
          Loyalty Points
        </h3>
        {loyalty?.locked ? (
          <p className="gotham text-white/70 text-[15px] leading-relaxed">
            This email has a registered account with saved loyalty points.{" "}
            <span className="text-[#cda873]">Sign in with your password</span> to view and redeem
            them — guest bookings can&apos;t touch your saved balance.
          </p>
        ) : loyalty ? (
          <>
            <p className="gotham text-white/70 text-[16px]">
              You have <span className="font-bold text-white">{loyalty.balance}</span> points
              {rate > 0 && <> — each worth {money(rate)}</>}.
            </p>
            {maxRedeemable > 0 ? (
              <div className="mt-5">
                <input
                  type="range"
                  min={0}
                  max={maxRedeemable}
                  value={pointsUsed}
                  onChange={(e) => onPointsChange(Number(e.target.value))}
                  className="w-full accent-[#cba660]"
                />
                <div className="flex justify-between mt-2">
                  <span className="gotham text-white/50 text-[14px]">0 pts</span>
                  <span className="gotham text-[#cda873] text-[16px] font-bold">
                    Redeem {pointsUsed} pts = {money(discount)} off
                  </span>
                  <span className="gotham text-white/50 text-[14px]">{maxRedeemable} pts</span>
                </div>
              </div>
            ) : (
              <p className="gotham text-white/40 text-[14px] mt-2">
                Earn points with every visit and social shoutout.
              </p>
            )}
          </>
        ) : (
          <p className="gotham text-white/40 text-[15px]">Loading balance…</p>
        )}
      </div>

      {/* Payment method */}
      <div className="bg-[#1d1d1d] border border-white/15 rounded-[22px] p-8 mb-6">
        <h3 className="gotham font-bold text-[#cba660] text-[14px] uppercase tracking-[0.25em] mb-5">
          Payment Method
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          {(
            [
              { value: "card", label: "Card", hint: "Pay securely now" },
              { value: "pay_upon_arrival", label: "Pay Upon Arrival", hint: "Settle at the salon" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 flex items-center gap-4 rounded-[18px] border px-6 py-5 cursor-pointer transition-colors ${
                paymentMethod === opt.value
                  ? "border-[#cba660] bg-[#cba660]/10"
                  : "border-white/15 hover:border-white/40"
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value={opt.value}
                checked={paymentMethod === opt.value}
                onChange={() => onPaymentMethodChange(opt.value)}
                className="accent-[#cba660] w-5 h-5"
              />
              <span>
                <span className="gotham font-bold text-white text-[17px] block">{opt.label}</span>
                <span className="gotham text-white/50 text-[14px]">{opt.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Anything we should know? (optional)"
        rows={3}
        className="w-full bg-[#1d1d1d] border border-white/15 rounded-[22px] px-6 py-4 text-white gotham text-[16px] placeholder:text-white/35 focus:border-[#cba660] focus:outline-none transition-colors mb-6"
      />

      {createAppointment.error && (
        <p className="gotham text-red-400 text-center text-[15px] mb-4">
          {createAppointment.error.message}
        </p>
      )}

      <button
        onClick={confirm}
        disabled={createAppointment.isPending}
        className="w-full bg-[#cba660] hover:bg-[#b8934e] disabled:opacity-50 text-black gotham font-bold text-[19px] rounded-full py-5 transition-colors cursor-pointer"
      >
        {createAppointment.isPending ? "Securing your slot…" : `Confirm Booking · ${money(total)}`}
      </button>
    </div>
  );
}
