"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useMe } from "@/lib/api/hooks/auth";
import { useCreateOrderMutation } from "@/lib/api/hooks/ecommerce";
import { showToast } from "@/app/components/salon/toast";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

function formatPrice(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

type DeliveryMethod = "standard" | "express" | "pickup";
type PaymentOption = "card" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user } = useMe();
  const { items, subtotal, clearCart, validateCart, isValidating } = useCart();
  const createOrderMutation = useCreateOrderMutation();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("card");
  const [notes, setNotes] = useState("");

  // Card details
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.email && !customerEmail) setCustomerEmail(user.email);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Shipping cost calculation
  const shippingCost = deliveryMethod === "express" ? 35.0 : 0.0;
  const tax = 0.0;
  const finalTotal = subtotal + shippingCost + tax;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (items.length === 0) {
      setValidationError("Your shopping bag is empty.");
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setValidationError("Please complete your contact details.");
      return;
    }

    if (deliveryMethod !== "pickup") {
      if (!addressLine1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
        setValidationError("Please fill in your complete delivery address.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Live stock & price validation check before placing
      const validationRes = await validateCart();
      if (!validationRes || !validationRes.valid || validationRes.has_out_of_stock) {
        setValidationError(
          validationRes?.messages?.[0] ??
            "Some items in your cart exceed available stock. Please adjust your bag."
        );
        setIsSubmitting(false);
        return;
      }

      // 2. Submit order to backend
      const payload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          variant_id: i.variant_id ?? null,
        })),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address_line1:
          deliveryMethod === "pickup" ? "Studio Pickup: 123 Studio Way" : addressLine1,
        shipping_address_line2: deliveryMethod === "pickup" ? "Brooklyn Studio" : addressLine2,
        shipping_city: deliveryMethod === "pickup" ? "Brooklyn" : city,
        shipping_state: deliveryMethod === "pickup" ? "NY" : state,
        shipping_postal_code: deliveryMethod === "pickup" ? "11201" : postalCode,
        shipping_country: country,
        shipping_method: deliveryMethod,
        payment_method: paymentOption,
        notes: notes.trim() || undefined,
      };

      const res = await createOrderMutation.mutateAsync(payload);

      // 3. Clear cart and redirect to order success
      clearCart();
      showToast("Order placed successfully!", "success");
      router.push(`/checkout/success?order_number=${encodeURIComponent(res.order.order_number)}`);
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      const msg = err?.message ?? "An error occurred while placing your order. Please try again.";
      setValidationError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white flex flex-col justify-between">
      <Header theme="dark" />

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 pt-32 pb-24 max-w-7xl">
        {/* Navigation Breadcrumb / Title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest text-[#cda873] hover:underline inline-flex items-center gap-1.5 mb-2 gotham"
            >
              <ArrowLeft size={14} /> Back to Catalog
            </Link>
            <h1 className="valturin text-3xl md:text-4xl text-white">Luxury Studio Checkout</h1>
            <p className="gotham text-sm text-gray-400 mt-1">
              Verify your order specifications and delivery details.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs gotham text-gray-400">
            <span className="flex items-center gap-1 text-[#c0a062]">
              <Lock size={13} /> 256-Bit Encrypted
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-gray-300">
              <ShieldCheck size={14} className="text-[#c0a062]" /> Certified Salon Verification
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#222222] rounded-2xl border border-white/10 max-w-xl mx-auto p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="valturin text-2xl text-white mb-3">Your Shopping Bag is Empty</h2>
            <p className="gotham text-sm text-gray-400 mb-8 max-w-sm mx-auto">
              Please add your desired custom units or hair care essentials before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-xs uppercase tracking-widest py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
            >
              Return to Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-8">
              {validationError && (
                <div className="bg-red-950/60 border border-red-500/40 rounded-xl p-4 flex items-start gap-3 text-red-200 text-sm gotham">
                  <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-300">Action Required</p>
                    <p className="mt-0.5">{validationError}</p>
                  </div>
                </div>
              )}

              {/* 1. Contact Information */}
              <section className="bg-[#222222] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#c0a062] text-black font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="valturin text-xl text-white">Client Details</h2>
                  </div>
                  {!user && (
                    <Link
                      href="/login"
                      className="text-xs gotham text-[#cda873] hover:underline"
                    >
                      Already have an account? Sign In
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs gotham">
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Samantha Vance"
                      className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      Email Address (for order tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="samantha@example.com"
                      className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Delivery Method */}
              <section className="bg-[#222222] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="w-7 h-7 rounded-full bg-[#c0a062] text-black font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="valturin text-xl text-white">Delivery Preference</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label
                    className={`border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all ${
                      deliveryMethod === "standard"
                        ? "border-[#c0a062] bg-[#c0a062]/10"
                        : "border-white/10 bg-[#171717] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <Truck size={18} className="text-[#c0a062]" />
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "standard"}
                        onChange={() => setDeliveryMethod("standard")}
                        className="accent-[#c0a062]"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold text-xs gotham text-white">Standard Delivery</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">2-4 Business Days</p>
                      <p className="text-[11px] text-[#c0a062] font-semibold mt-2">Complimentary</p>
                    </div>
                  </label>

                  <label
                    className={`border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all ${
                      deliveryMethod === "express"
                        ? "border-[#c0a062] bg-[#c0a062]/10"
                        : "border-white/10 bg-[#171717] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <Sparkles size={18} className="text-[#c0a062]" />
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "express"}
                        onChange={() => setDeliveryMethod("express")}
                        className="accent-[#c0a062]"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold text-xs gotham text-white">NYC Courier</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Same-Day Priority</p>
                      <p className="text-[11px] text-[#c0a062] font-semibold mt-2">$35.00</p>
                    </div>
                  </label>

                  <label
                    className={`border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all ${
                      deliveryMethod === "pickup"
                        ? "border-[#c0a062] bg-[#c0a062]/10"
                        : "border-white/10 bg-[#171717] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <PackageCheck size={18} className="text-[#c0a062]" />
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "pickup"}
                        onChange={() => setDeliveryMethod("pickup")}
                        className="accent-[#c0a062]"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold text-xs gotham text-white">Salon Fitting</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Brooklyn Studio Pickup</p>
                      <p className="text-[11px] text-[#c0a062] font-semibold mt-2">Complimentary</p>
                    </div>
                  </label>
                </div>

                {deliveryMethod !== "pickup" && (
                  <div className="space-y-4 pt-4 border-t border-white/5 text-xs gotham">
                    <h3 className="text-gray-300 font-semibold text-xs uppercase tracking-wider">
                      Shipping Address
                    </h3>
                    <div>
                      <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="123 Luxury Way"
                        className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                        Suite / Apartment / Floor (optional)
                      </label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Apt 4B"
                        className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="New York"
                          className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="NY"
                          className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="10001"
                          className="w-full bg-[#171717] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c0a062] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* 3. Payment Method */}
              <section className="bg-[#222222] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="w-7 h-7 rounded-full bg-[#c0a062] text-black font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="valturin text-xl text-white">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentOption === "card"
                        ? "border-[#c0a062] bg-[#c0a062]/10"
                        : "border-white/10 bg-[#171717] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-[#c0a062]" size={20} />
                      <div>
                        <p className="font-semibold text-xs gotham text-white">Credit / Debit Card</p>
                        <p className="text-[11px] text-gray-400">All major credit cards accepted</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === "card"}
                      onChange={() => setPaymentOption("card")}
                      className="accent-[#c0a062]"
                    />
                  </label>

                  <label
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentOption === "pickup"
                        ? "border-[#c0a062] bg-[#c0a062]/10"
                        : "border-white/10 bg-[#171717] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-[#c0a062]" size={20} />
                      <div>
                        <p className="font-semibold text-xs gotham text-white">Pay Upon In-Studio Arrival</p>
                        <p className="text-[11px] text-gray-400">Card or cash during personal fitting</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === "pickup"}
                      onChange={() => setPaymentOption("pickup")}
                      className="accent-[#c0a062]"
                    />
                  </label>
                </div>

                {paymentOption === "card" && (
                  <div className="bg-[#171717] border border-white/5 rounded-xl p-4 space-y-3 text-xs gotham mt-3">
                    <div>
                      <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#1f1f1f] border border-white/10 rounded px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#c0a062]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                          Expires
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#1f1f1f] border border-white/10 rounded px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#c0a062]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-[#1f1f1f] border border-white/10 rounded px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#c0a062]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 mb-1 text-[11px] uppercase tracking-wider gotham">
                    Special Instructions / Fitting Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify cap sizing, custom texture preference, or delivery gate notes..."
                    className="w-full bg-[#171717] border border-white/10 rounded-lg p-3 text-white text-xs gotham focus:outline-none focus:border-[#c0a062] transition-colors"
                  />
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-[#222222] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 lg:sticky lg:top-32">
                <h2 className="valturin text-xl text-white border-b border-white/10 pb-4">
                  Order Summary ({items.length} {items.length === 1 ? "piece" : "pieces"})
                </h2>

                {/* Items preview list */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {items.map((item) => {
                    const unitPrice = parseFloat(item.product.price) || 0;
                    return (
                      <div key={item.id} className="flex gap-3 items-center justify-between text-xs gotham">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-16 rounded bg-black/40 overflow-hidden shrink-0">
                            {item.product.image || item.product.background_image ? (
                              <img
                                src={item.product.image || item.product.background_image || ""}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-semibold text-white line-clamp-1">{item.product.name}</p>
                            <p className="text-gray-400 text-[11px] mt-0.5">
                              Qty: {item.quantity} × {formatPrice(unitPrice)}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#c0a062]">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals Calculation */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-xs gotham">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping & Handling</span>
                    <span className="text-[#c0a062] font-medium">
                      {shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Taxes</span>
                    <span className="text-gray-400">Calculated at arrival</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-3 border-t border-white/10 text-white">
                    <span>Total Due</span>
                    <span className="text-[#c0a062] text-lg">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isValidating}
                  className="w-full bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-xs uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                >
                  {isSubmitting || isValidating ? (
                    <span>Verifying & Processing Order…</span>
                  ) : (
                    <span>Place Order · {formatPrice(finalTotal)}</span>
                  )}
                </button>

                <p className="text-[11px] text-gray-500 text-center gotham">
                  By placing your order, you agree to October Glory&rsquo;s luxury salon policies and terms of service.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
