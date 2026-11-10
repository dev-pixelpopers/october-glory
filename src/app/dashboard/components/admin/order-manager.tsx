"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  Filter,
  Loader2,
  Package,
  PackageCheck,
  RefreshCw,
  Search,
  Truck,
  User as UserIcon,
  X,
} from "lucide-react";
import {
  useAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/lib/api/hooks/ecommerce";
import type { Order, OrderPaymentStatus, OrderStatus } from "@/lib/api/types";
import { money, shortDate } from "@/lib/format";
import {
  buttonGhost,
  buttonGold,
  Card,
  inputClass,
  StatusBadge,
} from "../dashboard-shell";

const STATUS_TABS: Array<{ id: string; label: string }> = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export default function OrderManager() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [managingOrder, setManagingOrder] = useState<Order | null>(null);

  const { data, isLoading, isFetching } = useAdminOrdersQuery({
    status: selectedStatus,
    q: searchQuery,
    page,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const counts = data?.counts ?? {
    all: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  return (
    <>
      <Card
        title="E-Commerce Orders & Fulfillment"
        action={
          <div className="flex items-center gap-2">
            <span className="gotham text-[12px] text-[var(--dash-text-muted)]">
              {counts.all} total {counts.all === 1 ? "order" : "orders"}
            </span>
          </div>
        }
      >
        {/* Top Controls: Status Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--dash-bg)] rounded-2xl border border-[var(--dash-border)]">
            {STATUS_TABS.map((tab) => {
              const countKey = tab.id as keyof typeof counts;
              const count = counts[countKey] ?? 0;
              const active = selectedStatus === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedStatus(tab.id);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] gotham transition-all cursor-pointer ${
                    active
                      ? "bg-[#cba660] text-black font-bold shadow-sm"
                      : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      active
                        ? "bg-black/20 text-black"
                        : "bg-[var(--dash-border-soft)] text-[var(--dash-text-muted)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] md:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] pointer-events-none"
            />
            <input
              type="text"
              className={`${inputClass} !py-2 !pl-10 !text-[14px]`}
              placeholder="Search order #, customer, tracking…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--dash-border)]">
                {[
                  "Order Number",
                  "Customer",
                  "Items",
                  "Shipping",
                  "Total",
                  "Payment",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest py-3 pr-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dash-border-soft)]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--dash-text-muted)]">
                    <Loader2 size={24} className="mx-auto mb-2 animate-spin text-[#cda873]" />
                    <p className="gotham text-[14px]">Loading orders…</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--dash-text-faint)]">
                    <Package size={32} className="mx-auto mb-2 opacity-30 text-[var(--dash-text)]" />
                    <p className="gotham text-[14px]">No orders found for current filter.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const placedDate = shortDate(order.created_at);
                  const firstItem = order.items?.[0];
                  const remainingItems = (order.items?.length ?? 1) - 1;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[var(--dash-border-soft)]/40 transition-colors group"
                    >
                      {/* Order # and Date */}
                      <td className="gotham py-4 pr-4">
                        <div className="font-bold text-[var(--dash-text)] text-[14px]">
                          #{order.order_number}
                        </div>
                        <div className="text-[12px] text-[var(--dash-text-muted)]">
                          {placedDate}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="gotham py-4 pr-4 max-w-[200px]">
                        <div className="font-medium text-[var(--dash-text)] text-[14px] truncate">
                          {order.customer_name}
                        </div>
                        <div className="text-[12px] text-[var(--dash-text-muted)] truncate">
                          {order.customer_email}
                        </div>
                        {order.customer_phone && (
                          <div className="text-[11px] text-[var(--dash-text-faint)]">
                            {order.customer_phone}
                          </div>
                        )}
                      </td>

                      {/* Items */}
                      <td className="gotham py-4 pr-4 max-w-[220px]">
                        {firstItem ? (
                          <div>
                            <span className="text-[13px] text-[var(--dash-text-soft)] truncate block font-medium">
                              {firstItem.name}
                              <span className="text-[#cda873] ml-1">×{firstItem.quantity}</span>
                            </span>
                            {remainingItems > 0 && (
                              <span className="text-[11px] text-[var(--dash-text-muted)]">
                                + {remainingItems} more {remainingItems === 1 ? "item" : "items"}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[12px] text-[var(--dash-text-muted)]">
                            {order.total_items} items
                          </span>
                        )}
                      </td>

                      {/* Shipping */}
                      <td className="gotham py-4 pr-4">
                        <div className="text-[13px] text-[var(--dash-text-soft)]">
                          {order.shipping?.city}, {order.shipping?.state}
                        </div>
                        <div className="text-[11px] text-[#cda873] uppercase tracking-wider capitalize">
                          {order.shipping?.method?.replace(/_/g, " ") ?? "Standard"}
                        </div>
                        {order.shipping?.tracking_number && (
                          <div className="text-[11px] text-sky-400 font-mono mt-0.5">
                            Trk: {order.shipping.tracking_number}
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="gotham py-4 pr-4">
                        <span className="font-bold text-[#cda873] text-[15px]">
                          {money(order.pricing?.total ?? 0)}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="gotham py-4 pr-4">
                        <StatusBadge status={order.payment_status} />
                      </td>

                      {/* Status */}
                      <td className="gotham py-4 pr-4">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Action */}
                      <td className="gotham py-4 pr-4">
                        <button
                          type="button"
                          onClick={() => setManagingOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] text-[12px] text-[var(--dash-text-muted)] hover:text-[#cda873] transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-[var(--dash-border-soft)] text-[13px] gotham text-[var(--dash-text-muted)]">
            <p>
              Showing {(meta.current_page - 1) * meta.per_page + 1} to{" "}
              {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3.5 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2 font-medium text-[var(--dash-text)]">
                {page} / {meta.last_page}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page >= meta.last_page}
                className="px-3.5 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Order Fulfillment & Status Modal */}
      {managingOrder && (
        <OrderFulfillmentModal
          order={managingOrder}
          onClose={() => setManagingOrder(null)}
          onSuccess={(updated) => {
            setManagingOrder(updated);
          }}
        />
      )}
    </>
  );
}

/* ------------------------ Order Fulfillment Modal ----------------------------- */

interface OrderFulfillmentModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: (updated: Order) => void;
}

function OrderFulfillmentModal({ order, onClose, onSuccess }: OrderFulfillmentModalProps) {
  const updateStatus = useUpdateOrderStatusMutation();

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.shipping?.tracking_number ?? "");
  const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatus>(order.payment_status);
  const [notes, setNotes] = useState(order.notes ?? "");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    updateStatus.mutate(
      {
        orderId: order.id,
        status,
        tracking_number: trackingNumber.trim() || null,
        payment_status: paymentStatus,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          setSuccessMsg(res.message);
          onSuccess(res.order);
          setTimeout(() => setSuccessMsg(null), 3000);
        },
      }
    );
  };

  const isCancelled = status === "cancelled";
  const wasCancelledOriginally = order.status === "cancelled";

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[var(--dash-card)] border border-[#cba660]/30 rounded-[24px] p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[var(--dash-border-soft)] pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="valturin text-xl sm:text-2xl text-white">
                Order #{order.order_number}
              </h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="gotham text-xs text-[var(--dash-text-muted)] mt-1">
              Placed on {shortDate(order.created_at)} · Payment:{" "}
              <span className="capitalize font-medium text-[var(--dash-text-soft)]">
                {order.payment_status} via {order.payment_method}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3.5 flex items-center gap-2 text-emerald-200 text-xs gotham animate-in fade-in">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-2xl p-4 text-xs gotham">
          <div>
            <span className="text-[var(--dash-text-faint)] uppercase tracking-wider block font-semibold mb-1">
              Customer Information
            </span>
            <p className="text-[var(--dash-text)] font-medium text-[13px]">{order.customer_name}</p>
            <p className="text-[var(--dash-text-muted)]">{order.customer_email}</p>
            <p className="text-[var(--dash-text-muted)]">{order.customer_phone}</p>
          </div>
          <div>
            <span className="text-[var(--dash-text-faint)] uppercase tracking-wider block font-semibold mb-1">
              Shipping Destination
            </span>
            <p className="text-[var(--dash-text)]">
              {order.shipping?.address_line1}
              {order.shipping?.address_line2 ? `, ${order.shipping.address_line2}` : ""}
            </p>
            <p className="text-[var(--dash-text-muted)]">
              {order.shipping?.city}, {order.shipping?.state} {order.shipping?.postal_code}
            </p>
            <p className="text-[#cda873] font-medium mt-1 uppercase tracking-wider">
              {order.shipping?.method?.replace(/_/g, " ") ?? "Standard"} Shipping
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div>
          <h4 className="gotham font-bold text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] mb-3">
            Ordered Items ({order.items?.length ?? 0})
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {(order.items ?? []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border-soft)] text-xs gotham"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/5">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Package size={16} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--dash-text)] font-medium truncate">{item.name}</p>
                    <p className="text-[var(--dash-text-muted)] text-[11px]">
                      Qty: {item.quantity} · {money(item.unit_price)} each
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#cda873] text-[13px]">
                    {money(item.line_total)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-3 border-t border-[var(--dash-border-soft)] mt-3 space-y-1.5 text-xs gotham text-[var(--dash-text-muted)]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[var(--dash-text)]">{money(order.pricing?.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-[#cda873]">
                {order.pricing?.shipping === 0 ? "Complimentary" : money(order.pricing?.shipping ?? 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="text-[var(--dash-text)]">{money(order.pricing?.tax ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[var(--dash-border-soft)]">
              <span>Grand Total</span>
              <span className="text-[#cda873] text-base">{money(order.pricing?.total ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Fulfillment & Status Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-[var(--dash-border-soft)]">
          <h4 className="gotham font-bold text-[13px] uppercase tracking-wider text-[#cda873]">
            Update Order Status & Tracking
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Selector */}
            <div>
              <label className="block gotham text-[12px] text-[var(--dash-text-faint)] uppercase tracking-wider mb-1.5">
                Fulfillment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className={inputClass}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block gotham text-[12px] text-[var(--dash-text-faint)] uppercase tracking-wider mb-1.5">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as OrderPaymentStatus)}
                className={inputClass}
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Tracking Number Input */}
          <div>
            <label className="block gotham text-[12px] text-[var(--dash-text-faint)] uppercase tracking-wider mb-1.5">
              Carrier Tracking Number
            </label>
            <div className="relative">
              <Truck
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)]"
              />
              <input
                type="text"
                placeholder="e.g. 1Z9999999999999999 (UPS / FedEx / Courier)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className={`${inputClass} !pl-10`}
              />
            </div>
            <p className="gotham text-[11px] text-[var(--dash-text-muted)] mt-1">
              Saving a tracking number will notify the client with updated tracking details.
            </p>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block gotham text-[12px] text-[var(--dash-text-faint)] uppercase tracking-wider mb-1.5">
              Internal Admin Notes
            </label>
            <textarea
              rows={2}
              placeholder="Private notes about packaging, special requests, or courier details…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Cancellation Warning Notice */}
          {isCancelled && !wasCancelledOriginally && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5 text-amber-200 text-xs gotham">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Inventory Restoration</p>
                <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                  Marking this order as cancelled will automatically return all purchased item quantities back into live salon inventory.
                </p>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {updateStatus.error && (
            <p className="gotham text-red-400 text-xs">
              {updateStatus.error.message || "Failed to update order status."}
            </p>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={buttonGhost}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={updateStatus.isPending}
              className={buttonGold}
            >
              {updateStatus.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Saving Changes…
                </span>
              ) : (
                "Save Order Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
