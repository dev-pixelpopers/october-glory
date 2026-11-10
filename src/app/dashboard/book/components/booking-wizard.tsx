"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePackages, useServices } from "@/lib/api/hooks/catalog";
import type {
  Appointment,
  AvailabilitySlot,
  Package,
  PaymentMethod,
  Service,
  Worker,
} from "@/lib/api/types";
import StepServices from "./step-services";
import StepSpecialist from "./step-specialist";
import StepDateTime from "./step-datetime";
import StepCheckout from "./step-checkout";
import StepConfirmation from "./step-confirmation";
import SummaryDrawer from "./summary-drawer";

const STEPS = ["Services", "Specialist", "Date & Time", "Checkout", "Confirmed"] as const;

export interface BookingWizardProps {
  initialServiceSlug?: string | null;
  initialPackageSlug?: string | null;
}

export default function BookingWizard({
  initialServiceSlug,
  initialPackageSlug,
}: BookingWizardProps = {}) {
  const searchParams = useSearchParams();
  const effectiveServiceSlug =
    initialServiceSlug ?? searchParams.get("service") ?? searchParams.get("slug");
  const effectivePackageSlug =
    initialPackageSlug ?? searchParams.get("package");

  const { data: allServices } = useServices();
  const { data: allPackages } = usePackages();

  const [step, setStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [anySpecialist, setAnySpecialist] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [pointsUsed, setPointsUsed] = useState(0);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  // Auto-selection from query parameters on load
  const processedParamRef = useRef<string | null>(null);

  useEffect(() => {
    if (effectivePackageSlug && !allPackages) return;
    if (effectiveServiceSlug && !allServices && !allPackages) return;
    if (!allServices && !allPackages) return;

    const targetParam = (effectivePackageSlug || effectiveServiceSlug)?.trim();
    if (!targetParam) return;

    // Avoid repeatedly re-selecting if already handled
    if (processedParamRef.current === targetParam) return;

    const findMatchingPackage = (query: string): Package | null => {
      const q = query.toLowerCase().trim();
      const direct = allPackages?.find(
        (p) =>
          p.slug?.toLowerCase() === q ||
          String(p.id) === q ||
          p.name.toLowerCase() === q ||
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === q,
      );
      if (direct) return direct;

      const fuzzy = allPackages?.find(
        (p) => p.slug?.toLowerCase().includes(q) || q.includes(p.slug?.toLowerCase() ?? ""),
      );
      return fuzzy ?? null;
    };

    const findMatchingServices = (query: string): Service[] => {
      const q = query.toLowerCase().trim();
      const direct = allServices?.find(
        (s) =>
          s.slug?.toLowerCase() === q ||
          String(s.id) === q ||
          s.name.toLowerCase() === q ||
          s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === q,
      );
      if (direct) return [direct];

      const fuzzy = allServices?.find(
        (s) => s.slug?.toLowerCase().includes(q) || q.includes(s.slug?.toLowerCase() ?? ""),
      );
      return fuzzy ? [fuzzy] : [];
    };

    // Priority 1: If ?package= is specified, find and select that package
    if (effectivePackageSlug) {
      const matchedPkg = findMatchingPackage(effectivePackageSlug);
      if (matchedPkg) {
        processedParamRef.current = targetParam;
        setSelectedPackage(matchedPkg);
        setServices(matchedPkg.services ?? []);
        setWorker(null);
        setAnySpecialist(false);
        setSlot(null);
        setStep(1);
        return;
      }
    }

    // Priority 2: If ?service= is specified, try service match
    if (effectiveServiceSlug) {
      const matchedSvc = findMatchingServices(effectiveServiceSlug);
      if (matchedSvc.length > 0) {
        processedParamRef.current = targetParam;
        setSelectedPackage(null);
        setServices(matchedSvc);
        setWorker(null);
        setAnySpecialist(false);
        setSlot(null);
        setStep(1);
        return;
      }

      // Fallback: check if the param actually was a package slug passed as service
      const fallbackPkg = findMatchingPackage(effectiveServiceSlug);
      if (fallbackPkg) {
        processedParamRef.current = targetParam;
        setSelectedPackage(fallbackPkg);
        setServices(fallbackPkg.services ?? []);
        setWorker(null);
        setAnySpecialist(false);
        setSlot(null);
        setStep(1);
        return;
      }
    }
  }, [allServices, allPackages, effectiveServiceSlug, effectivePackageSlug]);

  const subtotal = useMemo(
    () =>
      selectedPackage
        ? parseFloat(selectedPackage.price || selectedPackage.current_price || "0")
        : services.reduce((sum, s) => sum + parseFloat(s.current_price), 0),
    [selectedPackage, services],
  );

  const totalDuration = useMemo(
    () =>
      selectedPackage?.duration_minutes
        ? selectedPackage.duration_minutes
        : services.reduce((sum, s) => sum + s.duration_minutes, 0),
    [selectedPackage, services],
  );

  const toggleService = (service: Service) => {
    setSelectedPackage(null);
    setServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service],
    );
    // Selection changes invalidate downstream choices.
    setWorker(null);
    setAnySpecialist(false);
    setSlot(null);
  };

  const selectPackage = (pkg: Package | null) => {
    setSelectedPackage(pkg);
    setServices(pkg ? (pkg.services ?? []) : []);
    setWorker(null);
    setAnySpecialist(false);
    setSlot(null);
  };

  const canContinue =
    (step === 0 && (services.length > 0 || selectedPackage !== null)) ||
    (step === 1 && (worker !== null || anySpecialist)) ||
    (step === 2 && slot !== null);

  return (
    <div className="relative w-full max-w-[1100px] mx-auto px-6 pb-40">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-14 select-none">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                className={`w-[clamp(24px,20.12px_+_1.036vw,40px)] md:w-[clamp(48px,40.23px_+_2.071vw,80px)] h-[1px] ${i <= step ? "bg-[#cba660]" : "bg-white/20"}`}
              />
            )}
            <button
              type="button"
              disabled={i > step || (i === 1 && services.length === 0 && !selectedPackage)}
              onClick={() => {
                if (i <= step) setStep(i);
              }}
              className={`flex flex-col items-center gap-2 transition-opacity ${
                i <= step ? "cursor-pointer hover:opacity-80" : "cursor-default opacity-60"
              }`}
            >
              <span
                className={`flex items-center justify-center w-11 h-11 rounded-full border gotham text-[16px] transition-colors ${
                  i < step
                    ? "bg-[#cba660] border-[#cba660] text-black"
                    : i === step
                      ? "border-[#cba660] text-[#cba660]"
                      : "border-white/25 text-white/40"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span
                className={`gotham text-[13px] hidden md:block ${
                  i === step ? "text-[#cba660]" : "text-white/40"
                }`}
              >
                {label}
              </span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {step === 0 && (
        <StepServices
          selected={services}
          onToggle={toggleService}
          selectedPackage={selectedPackage}
          onSelectPackage={selectPackage}
          defaultTab={selectedPackage || effectivePackageSlug ? "packages" : "services"}
        />
      )}

      {step === 1 && (
        <StepSpecialist
          serviceIds={services.map((s) => s.id)}
          selectedWorker={worker}
          anySpecialist={anySpecialist}
          onSelect={(w) => {
            setWorker(w);
            setAnySpecialist(w === null);
            setSlot(null);
          }}
        />
      )}

      {step === 2 && (
        <StepDateTime
          serviceIds={services.map((s) => s.id)}
          packageId={selectedPackage?.id ?? null}
          workerId={worker?.id ?? null}
          totalDuration={totalDuration}
          date={date}
          slot={slot}
          onDateChange={(d) => {
            setDate(d);
            setSlot(null);
          }}
          onSlotSelect={setSlot}
        />
      )}

      {step === 3 && slot && (
        <StepCheckout
          selectedPackage={selectedPackage}
          services={services}
          slot={slot}
          subtotal={subtotal}
          totalDuration={totalDuration}
          workerId={worker?.id ?? null}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          pointsUsed={pointsUsed}
          onPointsChange={setPointsUsed}
          onConfirmed={(appt) => {
            setConfirmed(appt);
            setStep(4);
          }}
        />
      )}

      {step === 4 && confirmed && <StepConfirmation appointment={confirmed} />}

      {/* Sticky selection drawer with navigation (hidden on checkout/confirmation) */}
      {step < 3 && (
        <SummaryDrawer
          count={services.length}
          packageName={selectedPackage?.name ?? null}
          subtotal={subtotal}
          hasConsultation={!selectedPackage && services.some((s) => s.price_by_consultation)}
          totalDuration={totalDuration}
          slot={slot}
          workerName={anySpecialist ? "Any Specialist" : worker?.name ?? null}
          canContinue={canContinue}
          onBack={step > 0 ? () => setStep(step - 1) : undefined}
          onContinue={() => setStep(step + 1)}
        />
      )}
    </div>
  );
}
