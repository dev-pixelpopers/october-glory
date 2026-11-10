"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getToken } from "../client";
import type {
  CartValidationPayloadItem,
  CartValidationResponse,
  CreateOrderPayload,
  Order,
  OrderAdminIndexResponse,
  OrderStatus,
  Product,
  WishlistToggleResponse,
} from "../types";

/**
 * Fetch authenticated user's wishlist from the Laravel API.
 */
export function useWishlistQuery() {
  const token = typeof window !== "undefined" ? getToken() : null;

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get<{ data: Product[]; count: number }>("/v1/wishlist");
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Mutation to toggle a product in user's wishlist on backend.
 */
export function useToggleWishlistMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) =>
      api.post<WishlistToggleResponse>("/v1/wishlist/toggle", { product_id: productId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

/**
 * Mutation to validate cart items against live DB prices & stock.
 */
export function useValidateCartMutation() {
  return useMutation({
    mutationFn: (items: CartValidationPayloadItem[]) =>
      api.post<CartValidationResponse>("/v1/cart/validate", { items }),
  });
}

/* ------------------------------- Orders -------------------------------------- */

/**
 * Mutation to submit an e-commerce order.
 */
export function useCreateOrderMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      api.post<{ message: string; order: Order }>("/v1/orders", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
}

/**
 * Query client orders for authenticated user.
 */
export function useOrdersQuery(page = 1) {
  const token = typeof window !== "undefined" ? getToken() : null;

  return useQuery({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await api.get<{
        data: Order[];
        meta: { current_page: number; last_page: number; per_page: number; total: number };
      }>("/v1/orders", { params: { page } });
      return res;
    },
    enabled: !!token,
  });
}

/**
 * Query single order details.
 */
export function useOrderDetailsQuery(orderId: number | string | null) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await api.get<{ data: Order }>(`/v1/orders/${orderId}`);
      return res.data;
    },
    enabled: !!orderId,
  });
}

/**
 * Query all orders for Admin with status filter and search.
 */
export function useAdminOrdersQuery(params?: { status?: string; q?: string; page?: number }) {
  return useQuery({
    queryKey: ["admin", "orders", params?.status ?? "all", params?.q ?? "", params?.page ?? 1],
    queryFn: async () => {
      const res = await api.get<OrderAdminIndexResponse>("/admin/orders", {
        params: {
          status: params?.status === "all" ? undefined : params?.status,
          q: params?.q || undefined,
          page: params?.page ?? 1,
        },
      });
      return res;
    },
  });
}

/**
 * Mutation for admin to update order status and tracking.
 */
export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
      tracking_number,
      payment_status,
      notes,
    }: {
      orderId: number;
      status: OrderStatus;
      tracking_number?: string | null;
      payment_status?: string;
      notes?: string;
    }) =>
      api.patch<{ message: string; order: Order }>(`/admin/orders/${orderId}/status`, {
        status,
        tracking_number,
        payment_status,
        notes,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
}
