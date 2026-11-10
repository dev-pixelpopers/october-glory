"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  CartItem,
  CartValidationPayloadItem,
  CartValidationResponse,
  Product,
} from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { showToast } from "@/app/components/salon/toast";

const CART_STORAGE_KEY = "og_cart_items";

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant_id?: string | number | null) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  validateCart: () => Promise<CartValidationResponse | null>;
  isValidating: boolean;
  validationResult: CartValidationResponse | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CartValidationResponse | null>(null);

  // Rehydrate guest cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addItem = useCallback(
    (product: Product, quantity = 1, variant_id: string | number | null = null) => {
      const safeQty = Math.max(1, quantity);
      const itemId = variant_id ? `${product.id}-${variant_id}` : `${product.id}`;

      setItems((prevItems) => {
        const existingIdx = prevItems.findIndex((i) => i.id === itemId);
        if (existingIdx > -1) {
          const updated = [...prevItems];
          const newQty = updated[existingIdx].quantity + safeQty;
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            product: { ...product }, // sync latest product info
          };
          return updated;
        }
        return [
          ...prevItems,
          {
            id: itemId,
            product,
            quantity: safeQty,
            variant_id,
          },
        ];
      });

      showToast(`Added ${product.name} to shopping bag`, "success");
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        showToast(`Removed ${target.product.name} from bag`, "info");
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setValidationResult(null);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.product.price) || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  /**
   * Validate cart items against live DB prices and stock levels.
   */
  const validateCart = useCallback(async (): Promise<CartValidationResponse | null> => {
    if (items.length === 0) return null;

    setIsValidating(true);
    try {
      const payload: CartValidationPayloadItem[] = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        variant_id: item.variant_id ?? null,
      }));

      const res = await api.post<CartValidationResponse>("/v1/cart/validate", {
        items: payload,
      });

      setValidationResult(res);

      if (!res.valid || res.has_out_of_stock) {
        const errorMsg =
          res.messages?.[0] ?? "Some items in your cart exceed available stock.";
        showToast(errorMsg, "error");
      }

      return res;
    } catch (err: any) {
      console.error("Cart validation error:", err);
      showToast(err?.message ?? "Unable to validate cart. Please try again.", "error");
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      validateCart,
      isValidating,
      validationResult,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      validateCart,
      isValidating,
      validationResult,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
