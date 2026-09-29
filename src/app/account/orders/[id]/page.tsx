"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { ArrowLeft, HelpCircle, ShieldCheck, Clock, Key } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return <LoadingSpinner text="Loading order information..." size="lg" className="py-24" />;
  }

  if (error || !order) {
    return (
      <ErrorState
        title="Order Not Found"
        message="Could not load the requested order details."
        onRetry={() => router.push("/account/orders")}
      />
    );
  }

  const isFulfilled = order.status === "FULFILLED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/account/orders"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} size="sm" />
          </div>
          <p className="text-xs text-slate-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <Link href={`/account/support?orderId=${order.id}`}>
          <Button variant="secondary" size="sm" leftIcon={<HelpCircle className="h-3.5 w-3.5" />}>
            Open Support Ticket
          </Button>
        </Link>
      </div>

      {/* If Fulfilled: Show Prominent View Access Card */}
      {isFulfilled && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-raised flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
              <ShieldCheck className="h-3.5 w-3.5" /> Order Fulfilled &amp; Ready
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">Your Digital Access Is Ready</h3>
            <p className="text-xs text-blue-100 max-w-lg">
              Open your private delivery vault to view credentials, reveal license keys, or follow the custom activation guide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href={`/account/orders/${order.id}/access`}>
              <Button size="md" className="bg-white text-primary-600 hover:bg-[#F7F8FB] font-bold text-xs h-10 px-5 shadow-soft">
                <Key className="h-3.5 w-3.5 mr-1" /> View Access
              </Button>
            </Link>
            <Link href={`/account/orders/${order.id}/access?tab=activation`}>
              <Button variant="outline" size="md" className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold text-xs h-10 px-4">
                Activation Guide
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* If Pending Verification: Show Notice Card */}
      {(order.status === "PENDING_PAYMENT_VERIFICATION" || order.status === "PENDING_PAYMENT") && (
        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 shadow-soft flex items-start gap-3.5 text-purple-900">
          <Clock className="h-5 w-5 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm">Payment Verification In Progress</p>
            <p className="text-purple-700 leading-relaxed">
              Your payment proof (TrxID: <strong className="font-mono">{order.transactionId}</strong>) is currently waiting for admin review. Once verified, your license keys and login credentials will unlock here automatically.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Order Items & Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100">
              Purchased Items
            </h3>

            <div className="space-y-3 divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-primary-600 font-semibold mt-0.5">
                      {item.planName} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({order.couponCode || "Promo"})</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-primary-600 text-lg font-black">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Proof Details */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-soft space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base pb-2 border-b border-slate-100">
              Payment Submission Proof
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Payment Method
                </span>
                <span className="font-bold text-slate-800">
                  {order.paymentMethod?.displayName || "Manual"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Sender Number
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {order.senderNumber}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Transaction ID (TrxID)
                </span>
                <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block mt-0.5">
                  {order.transactionId}
                </span>
              </div>
              {order.paymentNote && (
                <div className="col-span-2 text-slate-600 bg-[#F7F8FB] p-2.5 rounded-xl border border-slate-200/70">
                  <strong>Note:</strong> {order.paymentNote}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100">
              Order Timeline
            </h3>
            <OrderTimeline events={order.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
