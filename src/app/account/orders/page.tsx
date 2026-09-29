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
import { OrderStatus } from "@/types/order";

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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
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
            label: "Pending Verification",
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
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Payment Info</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="py-4 font-bold text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 text-slate-800">
                      <div className="font-semibold">
                        {order.items[0]?.productName || "Digital Product"}
                      </div>
                      <div className="text-[11px] text-primary-600">
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
                            <Button size="sm" className="text-xs h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs">
                              View Access
                            </Button>
                          </Link>
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="text-xs h-8 px-2.5 text-slate-600">
                              Details
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-8 px-3">
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
      )}
    </div>
  );
}
