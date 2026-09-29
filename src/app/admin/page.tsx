"use client";

import React from "react";
import Link from "next/link";
import { useAdminMetrics, useAdminOrderMutations } from "@/hooks/useAdmin";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatPrice, formatShortDate } from "@/lib/utils/formatters";
import { useToast } from "@/hooks/useToast";
import {
  ShoppingBag,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: metrics, isLoading } = useAdminMetrics();
  const { approvePayment } = useAdminOrderMutations();
  const toast = useToast();

  if (isLoading || !metrics) {
    return <LoadingSpinner text="Loading dashboard metrics..." size="lg" className="py-24" />;
  }

  const handleQuickApprove = async (orderId: string) => {
    try {
      await approvePayment.mutateAsync(orderId);
      toast.success("Payment approved successfully!");
    } catch {
      toast.error("Failed to approve payment.");
    }
  };

  return (
    <div className="space-y-8">
      {/* 6 Core Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AdminStatCard
          title="Today's Orders"
          value={metrics.todayOrders}
          icon={<ShoppingBag className="h-5 w-5" />}
          growth={metrics.orderGrowthRate}
          variant="blue"
        />

        <AdminStatCard
          title="Pending Verification"
          value={metrics.pendingVerificationCount}
          icon={<Clock className="h-5 w-5" />}
          subtitle="Awaiting manual review"
          variant="purple"
        />

        <AdminStatCard
          title="Today's Revenue"
          value={formatPrice(metrics.todayRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          growth={metrics.revenueGrowthRate}
          variant="emerald"
        />

        <AdminStatCard
          title="Monthly Revenue"
          value={formatPrice(metrics.monthlyRevenue)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="blue"
        />

        <AdminStatCard
          title="Completed Orders"
          value={metrics.completedOrdersCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="emerald"
        />

        <AdminStatCard
          title="Active Customers"
          value={metrics.activeCustomersCount}
          icon={<Users className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      {/* Revenue Chart Visual Breakdown */}
      <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Weekly Revenue &amp; Order Volume Trend
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated daily performance over the past 7 days.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="h-3 w-3 rounded-full bg-primary-600" /> Revenue (BDT)
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="h-3 w-3 rounded-full bg-purple-500" /> Orders
            </span>
          </div>
        </div>

        {/* CSS Bar Chart Visualization */}
        <div className="h-48 sm:h-52 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2">
          {metrics.revenueChartData.map((item, idx) => {
            const maxRev = 12000;
            const heightPercent = Math.min(100, Math.round((item.revenue / maxRev) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(item.revenue)}
                </div>
                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-xl group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 mt-1">{item.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Verification Priority Queue */}
      {metrics.pendingOrders.length > 0 && (
        <div className="rounded-2xl border border-purple-200/80 bg-purple-50/30 p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-200/60">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Action Required: Pending Verification Queue ({metrics.pendingOrders.length})
                </h3>
                <p className="text-xs text-purple-700">
                  Customers awaiting manual bKash/Nagad TrxID review.
                </p>
              </div>
            </div>
            <Link href="/admin/orders">
              <Button variant="secondary" size="sm" className="font-bold text-xs">
                View All Orders
              </Button>
            </Link>
          </div>

          {/* Mobile Stacked Pending Orders (< md) */}
          <div className="space-y-3 md:hidden">
            {metrics.pendingOrders.map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-xl bg-white border border-purple-200/80 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">#{order.orderNumber}</span>
                    <span className="text-[10px] text-slate-500 font-bold block">{order.customerName}</span>
                  </div>
                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px] border border-purple-200">
                    {order.transactionId}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-mono">{order.senderNumber}</span>
                  <span className="font-black text-slate-900">{formatPrice(order.totalAmount)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="secondary" size="sm" className="w-full text-xs h-8 font-bold justify-center">
                      Review
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs h-8 font-bold justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleQuickApprove(order.id)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-200/60 text-purple-900 uppercase font-bold">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Method</th>
                  <th className="pb-2">Sender Phone</th>
                  <th className="pb-2">Transaction ID</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 font-medium">
                {metrics.pendingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-purple-100/40">
                    <td className="py-3 font-bold text-slate-900">#{order.orderNumber}</td>
                    <td className="py-3 text-slate-800">{order.customerName}</td>
                    <td className="py-3">{order.paymentMethod?.displayName || "Manual"}</td>
                    <td className="py-3 font-mono">{order.senderNumber}</td>
                    <td className="py-3 font-mono font-bold text-purple-700">
                      {order.transactionId}
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="secondary" size="sm" className="text-xs h-7 px-2">
                          Review
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="text-xs h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        onClick={() => handleQuickApprove(order.id)}
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Stacked Orders (< md) */}
        <div className="space-y-3 md:hidden">
          {metrics.recentOrders.map((order) => (
            <div
              key={order.id}
              className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900">#{order.orderNumber}</span>
                  <span className="text-[10px] text-slate-400 block">{formatShortDate(order.createdAt)}</span>
                </div>
                <OrderStatusBadge status={order.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                  {order.items[0]?.productName || "Digital Tool"}
                </span>
                <span className="font-black text-slate-900">{formatPrice(order.totalAmount)}</span>
              </div>

              <Link href={`/admin/orders/${order.id}`} className="block">
                <Button variant="secondary" size="sm" className="w-full text-xs h-8 font-bold justify-center">
                  Manage Order
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop Table (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Item / Plan</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {metrics.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 font-bold text-slate-900">#{order.orderNumber}</td>
                  <td className="py-3.5 text-slate-800">
                    <div>{order.customerName}</div>
                    <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="py-3.5 text-slate-700">
                    <div className="font-semibold">{order.items[0]?.productName}</div>
                    <div className="text-[11px] text-primary-600">{order.items[0]?.planName}</div>
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="py-3.5 text-slate-500">{formatShortDate(order.createdAt)}</td>
                  <td className="py-3.5">
                    <OrderStatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="py-3.5 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs h-7 px-2.5">
                        Manage
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
