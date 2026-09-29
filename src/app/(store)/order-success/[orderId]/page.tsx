"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatPrice } from "@/lib/utils/formatters";
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

import { Container } from "@/components/common/Container";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return <LoadingSpinner text="Loading order verification details..." size="lg" className="py-32" />;
  }

  if (!order) {
    return (
      <Container className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500">
          We couldn&apos;t find an order with this identification reference.
        </p>
        <Link href="/">
          <Button variant="primary" size="sm">
            Return Home
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12 space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-purple-200/80 bg-[var(--bg-surface)] p-6 sm:p-8 shadow-soft text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/80 shadow-soft">
          <Clock className="h-7 w-7 text-purple-600 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60">
            Order #{order.orderNumber}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Submitted for Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your payment information has been submitted and is waiting for admin verification. Once verified, your digital delivery credentials will unlock in your customer dashboard.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <OrderStatusBadge status={order.status} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Order Details & Items (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Submitted Items &amp; Payment Proof
            </h3>

            {/* Items */}
            <div className="space-y-3 divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-primary-600 font-medium">
                      Plan: {item.planName} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Details Table */}
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Provider:</span>
                <span className="font-bold text-slate-900">
                  {order.paymentMethod?.displayName || "Manual bKash/Nagad"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sender Number:</span>
                <span className="font-mono font-bold text-slate-900">
                  {order.senderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID (TrxID):</span>
                <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {order.transactionId}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-primary-600 text-base">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href={`/account/orders/${order.id}`} className="flex-1">
                <Button variant="primary" size="md" className="w-full font-bold shadow-soft justify-center">
                  Track in Customer Vault <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button variant="secondary" size="md" className="w-full font-semibold justify-center">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Order Timeline (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Live Fulfillment Timeline
            </h3>

            <OrderTimeline events={order.timeline} />
          </div>

          {/* Need help banner */}
          <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-4 sm:p-5 shadow-soft flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/80 shadow-soft">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900">Need Urgent Verification?</h4>
              <p className="text-[11px] text-slate-500">
                Message us with your Order ID #{order.orderNumber} for instant priority review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
