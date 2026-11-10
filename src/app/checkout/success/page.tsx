"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Check, Calendar, ArrowRight, ShoppingBag, Clock } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") || "OG-CONFIRMED";

  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-6 bg-[#222222] border border-white/10 rounded-3xl shadow-2xl">
      <div className="w-20 h-20 rounded-full bg-green-950/80 border border-green-500/40 flex items-center justify-center text-green-400 mx-auto mb-6">
        <Check size={40} />
      </div>

      <p className="gotham text-xs uppercase tracking-[4px] text-[#c0a062] font-semibold mb-2">
        Payment & Inventory Confirmed
      </p>

      <h1 className="valturin text-3xl md:text-4xl text-white mb-3">
        Thank You For Your Order
      </h1>

      <p className="gotham text-sm text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
        Your custom luxury order has been registered with October Glory Studio. Our artisans and specialists are now preparing your pieces.
      </p>

      <div className="bg-[#171717] border border-white/5 rounded-2xl p-5 mb-8 text-left space-y-3 text-xs gotham">
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-gray-400">Order Number</span>
          <span className="text-[#c0a062] font-mono font-semibold text-sm">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-gray-400">Order Status</span>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
            Processing & Packaging
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Confirmation Notification</span>
          <span className="text-green-400 flex items-center gap-1 font-medium">
            <Check size={14} /> Dispatched to Your Dashboard & Email
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard?tab=orders"
          className="bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-xs uppercase tracking-widest py-3.5 px-8 rounded-sm transition-colors flex items-center justify-center gap-2"
        >
          <Clock size={16} />
          View In Client Orders
        </Link>
        <Link
          href="/shop"
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs uppercase tracking-widest py-3.5 px-8 rounded-sm transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white flex flex-col justify-between">
      <Header theme="dark" />

      <main className="container mx-auto px-4 pt-36 pb-24">
        <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading order details…</div>}>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
