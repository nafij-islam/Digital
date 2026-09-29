"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminOrders, useAdminOrderMutations } from "@/hooks/useAdmin";
import { formatPrice, formatShortDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useToast } from "@/hooks/useToast";
import { Clock, CheckCircle2, XCircle, Eye, ShieldCheck } from "lucide-react";

export default function AdminPaymentsQueuePage() {
  const { data: orders = [], isLoading } = useAdminOrders("PENDING_PAYMENT_VERIFICATION");
  const { approvePayment, rejectPayment } = useAdminOrderMutations();
  const toast = useToast();

  const handleApprove = async (orderId: string) => {
    try {
      await approvePayment.mutateAsync(orderId);
      toast.success("Payment verified and approved!");
    } catch {
      toast.error("Failed to approve payment.");
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await rejectPayment.mutateAsync({ orderId, reason: "Invalid TrxID" });
      toast.error("Payment rejected.");
    } catch {
      toast.error("Failed to reject payment.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Manual Payment Verification Queue
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review submitted bKash and Nagad transaction proofs from customers before fulfilling orders.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading payment verification queue..." size="md" className="py-16" />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Verification queue is clear"
          description="All manual payments have been verified and processed."
        />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Sender Phone</th>
                  <th className="pb-3">Transaction ID (TrxID)</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3 text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-purple-50/30">
                    <td className="py-4 font-bold text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 font-semibold text-slate-700">
                      {order.paymentMethod?.displayName || "Manual"}
                    </td>
                    <td className="py-4 font-mono font-bold text-slate-900">
                      {order.senderNumber}
                    </td>
                    <td className="py-4">
                      <span className="font-mono font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs select-all">
                        {order.transactionId}
                      </span>
                    </td>
                    <td className="py-4 font-black text-slate-900 text-sm">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatShortDate(order.paymentSubmittedAt || order.createdAt)}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                          <Eye className="h-3 w-3 mr-1" /> Inspect
                        </Button>
                      </Link>
                      <Button
                        variant="success"
                        size="sm"
                        className="text-xs h-7 px-2.5"
                        onClick={() => handleApprove(order.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => handleReject(order.id)}
                      >
                        Reject
                      </Button>
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
