"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { ArrowRight, Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { getUnit } from "@/data/units";

function formatPrice(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return (num || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function WishlistDrawer() {
  const { items, isWishlistOpen, closeWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addItem, openCart } = useCart();

  useEffect(() => {
    if (!isWishlistOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWishlist();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isWishlistOpen, closeWishlist]);

  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWishlistOpen]);

  const handleMoveToCart = (product: any) => {
    addItem(product, 1);
    closeWishlist();
    openCart();
  };

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-over panel */}
      <aside className="relative z-10 w-full max-w-md md:max-w-lg bg-[#1B1B1B] text-white h-full shadow-2xl border-l border-white/10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#141414]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c0a062]/10 border border-[#c0a062]/30 flex items-center justify-center text-[#c0a062]">
              <Heart size={18} className="fill-[#c0a062]" />
            </div>
            <div>
              <h2 className="valturin text-lg text-[#cda873] tracking-wide">Saved Items</h2>
              <p className="gotham text-xs text-gray-400">
                {wishlistCount} {wishlistCount === 1 ? "piece" : "pieces"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeWishlist}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-4">
                <Heart size={28} />
              </div>
              <h3 className="valturin text-xl text-white mb-2">No Saved Pieces</h3>
              <p className="gotham text-sm text-gray-400 max-w-xs mb-8 leading-relaxed">
                Save your favorite units and custom finishes to review or order at any time.
              </p>
              <Link
                href="/shop"
                onClick={closeWishlist}
                className="bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-xs uppercase tracking-widest py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
              >
                Browse Catalog
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            items.map((product) => {
              const isWig = getUnit(product.slug) !== undefined;
              const href = isWig ? `/wigs/${product.slug}` : `/shop`;

              return (
                <div
                  key={product.id}
                  className="bg-[#222222] rounded-xl p-3.5 border border-white/5 hover:border-white/15 transition-all flex gap-4"
                >
                  <Link
                    href={href}
                    onClick={closeWishlist}
                    className="w-20 h-24 rounded-lg bg-black/40 overflow-hidden shrink-0 block relative group"
                  >
                    {product.image || product.background_image ? (
                      <img
                        src={product.image || product.background_image || ""}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Heart size={20} />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={href}
                          onClick={closeWishlist}
                          className="text-white hover:text-[#c0a062] font-medium text-sm gotham leading-snug transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {product.category && (
                        <p className="gotham text-[11px] text-[#cda873] uppercase tracking-wider mt-0.5">
                          {product.category}
                        </p>
                      )}

                      <p className="gotham font-semibold text-sm text-[#c0a062] mt-2">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 bg-[#c0a062] hover:bg-[#a6884f] text-black font-semibold text-[11px] uppercase tracking-wider py-2 px-3 rounded-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag size={13} />
                        Add to Bag
                      </button>
                      <Link
                        href={href}
                        onClick={closeWishlist}
                        className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-[11px] uppercase tracking-wider py-2 px-3 rounded-sm border border-white/10 transition-colors text-center"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#141414] flex justify-between items-center text-xs gotham">
            <span className="text-gray-400">Total Saved Pieces: {wishlistCount}</span>
            <Link
              href="/shop"
              onClick={closeWishlist}
              className="text-[#c0a062] hover:underline uppercase tracking-wider"
            >
              Continue Shopping →
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
