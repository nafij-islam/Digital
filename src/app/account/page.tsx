"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatShortDate } from "@/lib/utils/formatters";
import {
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Key,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";


export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { data: orders = [] } = useOrders();


  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING_PAYMENT" || o.status === "PENDING_PAYMENT_VERIFICATION"
  );
  const fulfilledOrders = orders.filter((o) => o.status === "FULFILLED");


  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 sm:p-8 shadow-neu-raised flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-neu-fade">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#29294D] border border-[#353560]/40 px-3 py-1 text-xs font-mono font-bold text-[#716DFF] shadow-neu-pressed">
            <Sparkles className="h-3.5 w-3.5 text-[#716DFF]" /> CUSTOMER ACCOUNT VAULT
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F5FA] tracking-tight">
            Hello, {user?.name || "Customer"}!
          </h1>
          <p className="text-xs text-[#AAAAC1]">
            Track your digital subscriptions, unlock credentials, and review orders.
          </p>
        </div>

        <Link href="/products">
          <Button
            variant="primary"
            size="sm"
            className="font-bold shadow-neu-raised"
          >
            Explore Library
          </Button>
        </Link>
      </div>

      {/* Summary 3-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 shadow-neu-raised space-y-2 animate-neu-fade">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
              Fulfilled Access
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#29294D] text-[#6CD6B3] flex items-center justify-center border border-[#353560]/40 shadow-neu-pressed">
              <Key className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#6CD6B3] font-mono">{fulfilledOrders.length}</div>
        </div>

        <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 shadow-neu-raised space-y-2 animate-neu-fade">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
              Pending Verification
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#29294D] text-[#716DFF] flex items-center justify-center border border-[#353560]/40 shadow-neu-pressed">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#716DFF] font-mono">{pendingOrders.length}</div>
        </div>

        <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 shadow-neu-raised space-y-2 animate-neu-fade">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
              Total Orders
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#29294D] text-[#AAAAC1] flex items-center justify-center border border-[#353560]/40 shadow-neu-pressed">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F5F5FA] font-mono">{orders.length}</div>
        </div>
      </div>

      {/* Active Fulfilled Passes Vault Quick View */}
      {fulfilledOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5FA] font-mono tracking-wider">ACTIVE SUBSCRIPTION KEYS</h2>
            <Link
              href="/account/orders"
              className="text-xs font-mono font-bold text-[#716DFF] hover:underline flex items-center gap-1"
            >
              All Orders <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fulfilledOrders.slice(0, 2).map((order) => {
              const item = order.items?.[0];
              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 shadow-neu-raised flex flex-col justify-between space-y-4 animate-neu-fade"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#6CD6B3] bg-[#29294D] px-2.5 py-0.5 rounded-full mb-1 border border-[#353560]/40 shadow-neu-pressed">
                        <CheckCircle2 className="h-3 w-3" /> FULFILLED
                      </div>
                      <h3 className="font-bold text-[#F5F5FA] text-sm sm:text-base">
                        {item?.productName || "Digital Subscription"}
                      </h3>
                      <p className="text-xs text-[#AAAAC1] mt-0.5 font-mono">
                        Plan: <span className="font-semibold text-[#716DFF]">{item?.planName}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#777790]">
                      #{order.orderNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#353560]/40">
                    <span className="text-xs font-mono font-black text-[#F5F5FA]">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <Link href={`/account/orders/${order.id}/access`}>
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs h-8 px-3.5 font-bold shadow-neu-raised"
                      >
                        View Access
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-6 shadow-neu-raised space-y-4 animate-neu-fade">
        <div className="flex items-center justify-between pb-3 border-b border-[#353560]/40">
          <h3 className="font-bold text-[#F5F5FA] text-base font-mono tracking-wider">RECENT ORDERS</h3>
          <Link
            href="/account/orders"
            className="text-xs font-mono font-bold text-[#716DFF] hover:underline flex items-center gap-1"
          >
            All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-[#777790] text-xs font-mono">
            No orders placed yet. Start by exploring our store!
          </div>
        ) : (
          <>
            {/* Mobile Stacked Orders (< md) */}
            <div className="space-y-3 md:hidden">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-2xl bg-[#29294D] border border-[#353560]/40 shadow-neu-pressed space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#F5F5FA]">#{order.orderNumber}</span>
                      <span className="text-[10px] text-[#777790] font-mono block">{formatShortDate(order.createdAt)}</span>
                    </div>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#AAAAC1] truncate max-w-[180px]">
                      {order.items[0]?.productName || "Digital Subscription"}
                    </span>
                    <span className="font-mono font-black text-[#6CD6B3]">{formatPrice(order.totalAmount)}</span>
                  </div>
                  {order.status === "FULFILLED" ? (
                    <Link href={`/account/orders/${order.id}/access`} className="block">
                      <Button variant="primary" size="sm" className="w-full text-xs h-9 font-bold justify-center">
                        View Access
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/account/orders/${order.id}`} className="block">
                      <Button variant="secondary" size="sm" className="w-full text-xs h-9 font-bold justify-center">
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#353560]/40 text-[#777790] uppercase tracking-wider font-bold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#353560]/40 font-medium">
                  {orders.slice(0, 4).map((order) => (
                    <tr key={order.id} className="hover:bg-[#29294D]/40">
                      <td className="py-3.5 font-bold text-[#F5F5FA]">#{order.orderNumber}</td>
                      <td className="py-3.5 text-[#AAAAC1]">
                        {order.items[0]?.productName || "Digital Subscription"}
                        {order.items.length > 1 && (
                          <span className="text-[10px] text-[#777790] ml-1">
                            (+{order.items.length - 1} more)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-bold text-[#6CD6B3]">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3.5 text-[#777790]">{formatShortDate(order.createdAt)}</td>
                      <td className="py-3.5">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-3.5 text-right">
                        {order.status === "FULFILLED" ? (
                          <Link href={`/account/orders/${order.id}/access`}>
                            <Button
                              size="sm"
                              variant="primary"
                              className="text-xs h-7 px-2.5 font-bold shadow-neu-raised"
                            >
                              Access
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="secondary" size="sm" className="text-xs h-7 px-2.5 font-semibold">
                              Details
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
