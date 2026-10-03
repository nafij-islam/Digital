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
        <h2 className="text-2xl font-black text-[#F5F5FA]">Cartridge Transmission Not Found</h2>
        <p className="text-xs text-[#AAAAC1]">
          We couldn&apos;t find an order with this identification reference.
        </p>
        <Link href="/">
          <Button variant="primary" size="sm">
            Return to Console Home
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 sm:p-8 shadow-neu-raised text-center space-y-4 animate-neu-fade">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#29294D] text-[#716DFF] flex items-center justify-center border border-[#353560]/40 shadow-neu-pressed">
          <Clock className="h-7 w-7 text-[#716DFF] animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#716DFF] bg-[#29294D] px-3 py-1 rounded-full border border-[#353560]/40 shadow-neu-pressed">
            PROTOCOL ORDER #{order.orderNumber}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F5FA] tracking-tight">
            Order Queued for Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#AAAAC1] max-w-lg mx-auto leading-relaxed">
            Your manual transaction telemetry has been received and is waiting for verification. Once approved, your digital activation credentials will unlock immediately in your vault.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <OrderStatusBadge status={order.status} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Order Details & Items (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-6 shadow-neu-raised space-y-4 animate-neu-fade">
            <h3 className="font-bold text-[#F5F5FA] text-base pb-3 border-b border-[#353560]/40 font-mono tracking-wider">
              TRANSMISSION TELEMETRY &amp; ITEMS
            </h3>

            {/* Items */}
            <div className="space-y-3 divide-y divide-[#353560]/40">
              {order.items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#F5F5FA] truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-[#716DFF] font-mono font-medium">
                      Plan: {item.planName} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-[#F5F5FA]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Details Table */}
            <div className="p-4 rounded-2xl bg-[#29294D] border border-[#353560]/40 shadow-neu-pressed space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#AAAAC1]">Payment Channel:</span>
                <span className="font-bold text-[#F5F5FA]">
                  {order.paymentMethod?.displayName || "Manual bKash/Nagad"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#AAAAC1]">Sender Number:</span>
                <span className="font-mono font-bold text-[#F5F5FA]">
                  {order.senderNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#AAAAC1]">Transaction ID:</span>
                <span className="font-mono font-bold text-[#716DFF] bg-[#303057] px-2 py-0.5 rounded-lg border border-[#353560]/40 shadow-neu-raised">
                  {order.transactionId}
                </span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-[#353560]/40 font-black text-sm text-[#F5F5FA]">
                <span>Total Amount Paid:</span>
                <span className="text-[#6CD6B3] text-base font-mono">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href={`/account/orders/${order.id}`} className="flex-1">
                <Button variant="primary" size="md" className="w-full font-bold shadow-neu-raised justify-center">
                  Track in Customer Vault <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button variant="secondary" size="md" className="w-full font-semibold justify-center">
                  Explore Cartridges
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Order Timeline (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-6 shadow-neu-raised space-y-4 animate-neu-fade">
            <h3 className="font-bold text-[#F5F5FA] text-base pb-3 border-b border-[#353560]/40 font-mono tracking-wider">
              SYSTEM TIMELINE
            </h3>

            <OrderTimeline events={order.timeline} />
          </div>

          {/* Need help banner */}
          <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-4 sm:p-5 shadow-neu-raised flex items-center gap-3.5 animate-neu-fade">
            <div className="h-10 w-10 rounded-xl bg-[#29294D] text-[#6CD6B3] flex items-center justify-center shrink-0 border border-[#353560]/40 shadow-neu-pressed">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#F5F5FA]">Need Priority Verification?</h4>
              <p className="text-[11px] text-[#AAAAC1]">
                Message us with Order ID #{order.orderNumber} for instant validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
