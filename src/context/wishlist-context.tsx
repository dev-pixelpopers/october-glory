"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product, WishlistToggleResponse } from "@/lib/api/types";
import { api, getToken } from "@/lib/api/client";
import { showToast } from "@/app/components/salon/toast";

const WISHLIST_STORAGE_KEY = "og_wishlist_items";

export interface WishlistContextType {
  items: Product[];
  isInWishlist: (productId: number | string) => boolean;
  toggleWishlist: (product: Product) => Promise<boolean>;
  wishlistCount: number;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Initial load from localStorage (guest fallback)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load wishlist from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. If user is authenticated, sync with Laravel API
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let isMounted = true;
    setIsLoading(true);

    api
      .get<{ data: Product[]; count: number }>("/v1/wishlist")
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res?.data)) {
          // Merge local guest items if any existed before login
          setItems((localItems) => {
            const apiItems = res.data;
            const apiMap = new Map(apiItems.map((p) => [p.id, p]));
            // Add any local items not yet in API
            const merged = [...apiItems];
            for (const local of localItems) {
              if (!apiMap.has(local.id)) {
                merged.push(local);
                // Also asynchronously persist local item to backend
                api.post("/v1/wishlist/toggle", { product_id: local.id }).catch(() => {});
              }
            }
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn("Could not sync wishlist with backend:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Persist to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist wishlist to localStorage", e);
    }
  }, [items, isLoaded]);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);
  const toggleWishlistDrawer = useCallback(() => setIsWishlistOpen((prev) => !prev), []);

  const isInWishlist = useCallback(
    (productId: number | string) => {
      const idNum = Number(productId);
      return items.some((p) => p.id === idNum);
    },
    [items]
  );

  const toggleWishlist = useCallback(
    async (product: Product): Promise<boolean> => {
      const idNum = Number(product.id);
      const exists = items.some((p) => p.id === idNum);
      const willBeInWishlist = !exists;

      // Optimistic state update
      setItems((prev) => {
        if (exists) {
          return prev.filter((p) => p.id !== idNum);
        }
        return [...prev, product];
      });

      if (willBeInWishlist) {
        showToast(`Saved ${product.name} to wishlist`, "success");
      } else {
        showToast(`Removed ${product.name} from wishlist`, "info");
      }

      // If user is authenticated, sync with backend
      const token = getToken();
      if (token) {
        try {
          const res = await api.post<WishlistToggleResponse>("/v1/wishlist/toggle", {
            product_id: idNum,
          });
          // Verify with server result
          if (res && res.in_wishlist !== willBeInWishlist) {
            // Reconcile if server differs
            if (res.in_wishlist) {
              setItems((prev) => (prev.some((p) => p.id === idNum) ? prev : [...prev, product]));
            } else {
              setItems((prev) => prev.filter((p) => p.id !== idNum));
            }
          }
        } catch (e) {
          console.warn("Failed to sync wishlist toggle with backend", e);
        }
      }

      return willBeInWishlist;
    },
    [items]
  );

  const wishlistCount = items.length;

  const value = useMemo(
    () => ({
      items,
      isInWishlist,
      toggleWishlist,
      wishlistCount,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      toggleWishlistDrawer,
      isLoading,
    }),
    [
      items,
      isInWishlist,
      toggleWishlist,
      wishlistCount,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      toggleWishlistDrawer,
      isLoading,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
