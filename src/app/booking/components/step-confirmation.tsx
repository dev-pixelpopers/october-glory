"use client";

import React from "react";
import Link from "next/link";
import SetPasswordBanner from "@/app/components/salon/set-password-banner";
import type { Appointment } from "@/lib/api/types";
import { dateLabel, durationLabel, money, timeLabel } from "@/lib/format";

export default function StepConfirmation({ appointment }: { appointment: Appointment }) {
  return (
    <div className="max-w-[640px] mx-auto text-center">
      <div className="flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#cba660] text-[#cba660] text-[44px] mx-auto mb-8">
        ✓
      </div>

      <h2 className="andrea text-white text-[64px] leading-none">You&apos;re Booked!</h2>
      <p className="valturin text-[#cda873] text-[30px] mt-2">
        We can&apos;t wait to see you shine.
      </p>

      <div className="bg-[#1d1d1d] border border-[#cba660]/30 rounded-[22px] p-8 mt-10 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-5">
          <span className="gotham text-white/50 text-[13px] uppercase tracking-[0.25em]">
            Booking Reference
          </span>
          <span className="gotham font-bold text-[#cda873] text-[22px]">
            {appointment.booking_reference}
          </span>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <dt className="gotham text-white/50 text-[13px] uppercase tracking-widest">When</dt>
            <dd className="gotham text-white text-[17px] mt-1">
              {dateLabel(appointment.start_time)}
              <br />
              {timeLabel(appointment.start_time)} – {timeLabel(appointment.end_time)}
            </dd>
          </div>
          <div>
            <dt className="gotham text-white/50 text-[13px] uppercase tracking-widest">
              Specialist
            </dt>
            <dd className="gotham text-white text-[17px] mt-1">{appointment.worker.name}</dd>
          </div>
          <div>
            <dt className="gotham text-white/50 text-[13px] uppercase tracking-widest">
              Duration
            </dt>
            <dd className="gotham text-white text-[17px] mt-1">
              {durationLabel(appointment.total_duration_minutes)}
            </dd>
          </div>
          <div>
            <dt className="gotham text-white/50 text-[13px] uppercase tracking-widest">
              Payment
            </dt>
            <dd className="gotham text-white text-[17px] mt-1">
              {appointment.payment_method === "card" ? "Card" : "Pay upon arrival"} ·{" "}
              {appointment.payment_status}
            </dd>
          </div>
        </dl>

        <div className="border-t border-white/10 mt-6 pt-5 flex flex-col gap-2">
          {appointment.services.map((line) => (
            <div key={line.id} className="flex justify-between">
              <span className="gotham text-white/80 text-[16px]">{line.service_name}</span>
              <span className="gotham text-white text-[16px]">{money(line.price_at_booking)}</span>
            </div>
          ))}
          {parseFloat(appointment.discount_amount) > 0 && (
            <div className="flex justify-between">
              <span className="gotham text-[#cda873] text-[16px]">
                Loyalty discount ({appointment.loyalty_points_used} pts)
              </span>
              <span className="gotham text-[#cda873] text-[16px]">
                −{money(appointment.discount_amount)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2">
            <span className="gotham font-bold text-white text-[19px]">Total</span>
            <span className="gotham font-bold text-[#cda873] text-[19px]">
              {money(appointment.total_amount)}
            </span>
          </div>
        </div>
      </div>

      <p className="gotham text-white/50 text-[15px] mt-6">
        A confirmation email with a calendar invite is on its way.
      </p>

      {/* Guest → full account conversion, right where the momentum is. */}
      <div className="text-left mt-8">
        <SetPasswordBanner />
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Link
          href="/dashboard"
          className="bg-[#cba660] hover:bg-[#b8934e] text-black gotham font-bold text-[17px] px-8 py-4 rounded-full transition-colors"
        >
          View My Appointments
        </Link>
        <Link
          href="/"
          className="border border-white/25 hover:border-white/60 text-white gotham text-[17px] px-8 py-4 rounded-full transition-colors"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
