"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminOrders } from "@/hooks/useAdmin";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice, formatShortDate } from "@/lib/utils/formatters";
import { OrderStatus } from "@/types/order";
import { Search, Eye, Filter } from "lucide-react";

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const statusParam = selectedStatus === "ALL" ? undefined : (selectedStatus as OrderStatus);
  const { data: orders = [], isLoading } = useAdminOrders(statusParam, search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify manual payments, manage workflow progression, and fulfill digital deliveries.
          </p>
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs
        activeTab={selectedStatus}
        onChange={setSelectedStatus}
        tabs={[
          { id: "ALL", label: "All Orders" },
          { id: "PENDING_PAYMENT_VERIFICATION", label: "Pending Verification" },
          { id: "PAYMENT_APPROVED", label: "Approved" },
          { id: "PROCESSING", label: "Processing" },
          { id: "FULFILLED", label: "Fulfilled" },
          { id: "PAYMENT_REJECTED", label: "Rejected" },
          { id: "CANCELLED", label: "Cancelled" },
        ]}
      />

      {/* Search Filter Bar */}
      <div className="max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, customer, email, or TrxID..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading orders list..." size="md" className="py-16" />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="No orders match your current filter parameters."
        />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product / Plan</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="py-4 font-bold text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold text-slate-800">
                        {order.items[0]?.productName || "Digital Tool"}
                      </div>
                      <div className="text-[10px] text-primary-600 font-medium">
                        {order.items[0]?.planName}
                      </div>
                    </td>
                    <td className="py-4 font-black text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-4 text-slate-600">
                      {order.paymentMethod?.displayName || "Manual"}
                    </td>
                    <td className="py-4">
                      <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {order.transactionId || "—"}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatShortDate(order.createdAt)}
                    </td>
                    <td className="py-4">
                      <OrderStatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                          <Eye className="h-3.5 w-3.5 mr-1" /> View / Action
                        </Button>
                      </Link>
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
