"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice, formatShortDate } from "@/lib/utils/formatters";
import { ArrowRight, Key, ShieldCheck } from "lucide-react";

export default function AccountOrdersPage() {
  const [selectedTab, setSelectedTab] = useState<string>("ALL");
  const { data: orders = [], isLoading } = useOrders();

  const filteredOrders = orders.filter((o) => {
    if (selectedTab === "ALL") return true;
    if (selectedTab === "PENDING")
      return (
        o.status === "PENDING_PAYMENT" || o.status === "PENDING_PAYMENT_VERIFICATION"
      );
    if (selectedTab === "PROCESSING") return o.status === "PROCESSING" || o.status === "PAYMENT_APPROVED";
    if (selectedTab === "FULFILLED") return o.status === "FULFILLED";
    if (selectedTab === "CANCELLED") return o.status === "CANCELLED" || o.status === "PAYMENT_REJECTED";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Order History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View past and active digital product orders, check verification status, and reveal licenses.
        </p>
      </div>

      {/* Tabs Filter */}
      <Tabs
        activeTab={selectedTab}
        onChange={setSelectedTab}
        tabs={[
          { id: "ALL", label: "All Orders", count: orders.length },
          {
            id: "PENDING",
            label: "Pending",
            count: orders.filter(
              (o) =>
                o.status === "PENDING_PAYMENT" ||
                o.status === "PENDING_PAYMENT_VERIFICATION"
            ).length,
          },
          {
            id: "PROCESSING",
            label: "Processing",
            count: orders.filter(
              (o) => o.status === "PROCESSING" || o.status === "PAYMENT_APPROVED"
            ).length,
          },
          {
            id: "FULFILLED",
            label: "Delivered",
            count: orders.filter((o) => o.status === "FULFILLED").length,
          },
        ]}
      />

      {isLoading ? (
        <LoadingSpinner text="Loading your orders..." size="md" className="py-16" />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="You don't have any orders in this status category."
        />
      ) : (
        <>
          {/* Mobile Stacked Order Cards (< md) */}
          <div className="md:hidden space-y-3.5">
            {filteredOrders.map((order) => {
              const primaryItem = order.items[0];
              const isFulfilled = order.status === "FULFILLED";

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Order Number
                      </span>
                      <span className="font-mono text-xs font-black text-slate-900">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {primaryItem?.productName || "Digital Product"}
                    </h4>
                    <p className="text-xs text-primary-600 font-semibold">
                      {primaryItem?.planName}
                      {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Order Date</span>
                      <span className="font-medium text-slate-700">{formatShortDate(order.createdAt)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Total Amount</span>
                      <span className="font-black text-slate-900 text-sm">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    {isFulfilled ? (
                      <>
                        <Link href={`/account/orders/${order.id}/access`} className="flex-1">
                          <Button size="sm" className="w-full text-xs font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-xs">
                            <Key className="h-3.5 w-3.5 mr-1" /> View Access
                          </Button>
                        </Link>
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="secondary" size="sm" className="text-xs">
                            Details
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href={`/account/orders/${order.id}`} className="w-full">
                        <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                          View Order Details <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table (md+) */}
          <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Product &amp; Plan</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F7F8FB]">
                      <td className="py-4 font-bold font-mono text-slate-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-4 text-slate-800">
                        <div className="font-bold">
                          {order.items[0]?.productName || "Digital Product"}
                        </div>
                        <div className="text-[11px] text-primary-600 font-semibold">
                          {order.items[0]?.planName}
                          {order.items.length > 1 && ` (+${order.items.length - 1} items)`}
                        </div>
                      </td>
                      <td className="py-4 text-slate-500">
                        <div className="font-semibold text-slate-700">
                          {order.paymentMethod?.displayName || "Manual"}
                        </div>
                        <div className="text-[10px] font-mono text-purple-600">
                          Trx: {order.transactionId}
                        </div>
                      </td>
                      <td className="py-4 font-black text-slate-900">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-4 text-slate-500">
                        {formatShortDate(order.createdAt)}
                      </td>
                      <td className="py-4">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-4 text-right">
                        {order.status === "FULFILLED" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/account/orders/${order.id}/access`}>
                              <Button size="sm" className="text-xs h-8 px-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-xs">
                                <Key className="h-3 w-3 mr-1" /> View Access
                              </Button>
                            </Link>
                            <Link href={`/account/orders/${order.id}`}>
                              <Button variant="secondary" size="sm" className="text-xs h-8 px-2.5 text-slate-600">
                                Details
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="secondary" size="sm" className="text-xs h-8 px-3">
                              View Order
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
