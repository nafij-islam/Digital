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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-white">
            <Sparkles className="h-3 w-3" /> Customer Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {user?.name || "Member"}!
          </h1>
          <p className="text-xs text-white/80">
            Track your digital deliveries, view secure access credentials, and review orders.
          </p>
        </div>

        <Link href="/products">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md"
          >
            Browse New Tools
          </Button>
        </Link>
      </div>

      {/* Summary 3-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Fulfilled Access
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Key className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{fulfilledOrders.length}</div>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending Verification
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingOrders.length}</div>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
        </div>
      </div>

      {/* Active Fulfilled Passes Vault Quick View */}
      {fulfilledOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Active Digital Access</h2>
            <Link
              href="/account/orders"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                  className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                        <CheckCircle2 className="h-3 w-3" /> Fulfilled
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {item?.productName || "Digital Tool"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Plan: <span className="font-semibold text-slate-700">{item?.planName}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{order.orderNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-black text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <Link href={`/account/orders/${order.id}/access`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-3.5 shadow-xs"
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

      {/* Recent Orders Table */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Recent Orders</h3>
          <Link
            href="/account/orders"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No orders found yet. Start by exploring our marketplace!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 font-bold text-slate-900">#{order.orderNumber}</td>
                    <td className="py-3.5 text-slate-700">
                      {order.items[0]?.productName || "Digital Product"}
                      {order.items.length > 1 && (
                        <span className="text-[10px] text-slate-400 ml-1">
                          (+{order.items.length - 1} more)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-black text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3.5 text-slate-500">{formatShortDate(order.createdAt)}</td>
                    <td className="py-3.5">
                      <OrderStatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-right">
                      {order.status === "FULFILLED" ? (
                        <Link href={`/account/orders/${order.id}/access`}>
                          <Button
                            size="sm"
                            className="text-xs h-7 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          >
                            View Access
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
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
        )}
      </div>
    </div>
  );
}
