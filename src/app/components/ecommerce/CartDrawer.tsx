"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { getUnit } from "@/data/units";

function formatPrice(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount,
    validateCart,
    isValidating,
    validationResult,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "confirmed">("cart");

  // Close on Escape key
  useEffect(() => {
    if (!isCartOpen) {
      setCheckoutStep("cart");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const router = useRouter();

  const handleProceedToCheckout = async () => {
    const res = await validateCart();
    if (res && res.valid && !res.has_out_of_stock) {
      closeCart();
      router.push("/checkout");
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-over panel */}
      <aside
        className="relative z-10 w-full max-w-md md:max-w-lg bg-[#1B1B1B] text-white h-full shadow-2xl border-l border-white/10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#141414]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c0a062]/10 border border-[#c0a062]/30 flex items-center justify-center text-[#c0a062]">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="valturin text-lg text-[#cda873] tracking-wide">Shopping Bag</h2>
              <p className="gotham text-xs text-gray-400">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && checkoutStep === "cart" && (
              <button
                type="button"
                onClick={clearCart}
                className="gotham text-[11px] text-gray-400 hover:text-red-400 transition-colors uppercase tracking-wider px-2 py-1"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Validation Warning Notice if out of stock */}
        {validationResult && !validationResult.valid && checkoutStep === "cart" && (
          <div className="bg-red-950/50 border-b border-red-500/30 px-6 py-3 flex items-start gap-3 text-red-200 text-xs gotham">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Inventory Notice</p>
              <p className="mt-0.5">
                {validationResult.messages?.[0] ?? "Some items in your cart exceed available stock."}
              </p>
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="valturin text-xl text-white mb-2">Your Bag is Empty</h3>
              <p className="gotham text-sm text-gray-400 max-w-xs mb-8 leading-relaxed">
                Explore our curated collection of custom wigs, bundles, and salon-grade essentials.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-xs uppercase tracking-widest py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
              >
                Explore Collection
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : checkoutStep === "confirmed" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-green-950 border border-green-500/50 flex items-center justify-center text-green-400 mb-4">
                <Check size={32} />
              </div>
              <h3 className="valturin text-2xl text-white mb-2">Order Reserved</h3>
              <p className="gotham text-sm text-gray-300 max-w-sm mb-6 leading-relaxed">
                Your items and live stock have been verified with October Glory Studio. Total:{" "}
                <span className="text-[#c0a062] font-semibold">{formatPrice(subtotal)}</span>.
              </p>
              <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left text-xs gotham space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Verified Items</span>
                  <span className="text-white font-medium">{itemCount}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Luxury Studio Shipping</span>
                  <span className="text-[#c0a062] font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-gray-400 pt-2 border-t border-white/10 font-semibold text-sm text-white">
                  <span>Order Total</span>
                  <span className="text-[#c0a062]">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Link
                  href={`/dashboard/book?service=the-glorious-custom-unit`}
                  onClick={closeCart}
                  className="w-full bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-sm transition-colors text-center"
                >
                  Book Salon Pickup & Install
                </Link>
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="text-gray-400 hover:text-white text-xs gotham underline underline-offset-4 py-2"
                >
                  Return to Bag Review
                </button>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const unitPrice = parseFloat(item.product.price) || 0;
              const lineTotal = unitPrice * item.quantity;
              const isWig = getUnit(item.product.slug) !== undefined;
              const itemHref = isWig ? `/wigs/${item.product.slug}` : `/shop`;

              // Check if validation flagged this specific item
              const validationItem = validationResult?.items.find(
                (vi) => vi.product_id === item.product.id
              );
              const isOutOfStock = validationItem && !validationItem.in_stock;

              return (
                <div
                  key={item.id}
                  className={`bg-[#222222] rounded-xl p-3.5 border transition-all flex gap-4 ${
                    isOutOfStock
                      ? "border-red-500/50 bg-red-950/20"
                      : "border-white/5 hover:border-white/15"
                  }`}
                >
                  {/* Thumbnail */}
                  <Link
                    href={itemHref}
                    onClick={closeCart}
                    className="w-20 h-24 rounded-lg bg-black/40 overflow-hidden shrink-0 block relative group"
                  >
                    {item.product.image || item.product.background_image ? (
                      <img
                        src={item.product.image || item.product.background_image || ""}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </Link>

                  {/* Info & Quantity */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={itemHref}
                          onClick={closeCart}
                          className="text-white hover:text-[#c0a062] font-medium text-sm gotham leading-snug transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {item.product.category && (
                        <p className="gotham text-[11px] text-[#cda873] uppercase tracking-wider mt-0.5">
                          {item.product.category}
                        </p>
                      )}

                      {isOutOfStock && (
                        <p className="text-red-400 text-[11px] gotham mt-1 font-medium flex items-center gap-1">
                          <AlertCircle size={12} />
                          {validationItem?.error ?? "Insufficient stock"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/10 rounded bg-black/30">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs gotham font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="gotham font-semibold text-sm text-[#c0a062]">
                          {formatPrice(lineTotal)}
                        </span>
                        {item.quantity > 1 && (
                          <p className="gotham text-[10px] text-gray-400">
                            {formatPrice(unitPrice)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {items.length > 0 && checkoutStep === "cart" && (
          <div className="p-6 border-t border-white/10 bg-[#141414] space-y-4">
            <div className="space-y-2 text-xs gotham">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Studio White-Glove Shipping</span>
                <span className="text-[#c0a062] font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/10 font-semibold">
                <span className="text-white">Estimated Total</span>
                <span className="text-[#c0a062] text-base">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isValidating}
              onClick={handleProceedToCheckout}
              className="w-full bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isValidating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying Live Inventory…
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-500 text-center gotham">
              Taxes & final consultation adjustments calculated at checkout.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
