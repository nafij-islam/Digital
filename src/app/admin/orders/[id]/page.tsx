"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminOrder, useAdminOrderMutations } from "@/hooks/useAdmin";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { DeliveryCredentialsCard } from "@/components/order/DeliveryCredentialsCard";
import { FulfillOrderModal } from "@/components/admin/FulfillOrderModal";
import { ConfirmActionModal } from "@/components/admin/ConfirmActionModal";
import { AdminAccessForm } from "@/components/admin/AdminAccessForm";
import { AdminActivationBuilder } from "@/components/admin/AdminActivationBuilder";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { generateWhatsAppOrderLink } from "@/lib/utils/whatsapp";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  ShieldCheck,
  UserCheck,
  Key,
  BookOpen,
  CreditCard,
  History,
  Info,
} from "lucide-react";
import { FulfillOrderPayload, OrderStatus } from "@/types/order";

type AdminTab = "OVERVIEW" | "PAYMENT" | "ACCESS" | "ACTIVATION" | "AUDIT";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>("OVERVIEW");

  const { data: order, isLoading, error, refetch } = useAdminOrder(id);
  const { approvePayment, rejectPayment, updateStatus, fulfillOrder } = useAdminOrderMutations();

  // Modals state
  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: "danger" | "primary" | "warning";
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "primary",
    onConfirm: async () => {},
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading order management..." size="lg" className="py-24" />;
  }

  if (error || !order) {
    return (
      <ErrorState
        title="Order Not Found"
        message="Could not find order to manage."
        onRetry={() => router.push("/admin/orders")}
      />
    );
  }

  const handleApprove = () => {
    setConfirmModal({
      isOpen: true,
      title: "Approve Manual Payment?",
      message: `Are you sure you want to approve TrxID ${order.transactionId} for ${formatPrice(
        order.totalAmount
      )}? This will move the order to Approved status.`,
      variant: "primary",
      onConfirm: async () => {
        await approvePayment.mutateAsync(order.id);
        toast.success("Payment approved.");
        refetch();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleReject = () => {
    setConfirmModal({
      isOpen: true,
      title: "Reject Payment Submission?",
      message: `Reject payment for order #${order.orderNumber}. The customer will be informed to review their transaction details.`,
      variant: "danger",
      onConfirm: async () => {
        await rejectPayment.mutateAsync({ orderId: order.id, reason: "Invalid TrxID" });
        toast.error("Payment rejected.");
        refetch();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleMarkProcessing = async () => {
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: "PROCESSING" });
      toast.success("Order status moved to Processing.");
      refetch();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleCancelOrder = () => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel Order?",
      message: "Are you sure you want to cancel this order completely?",
      variant: "danger",
      onConfirm: async () => {
        await updateStatus.mutateAsync({ orderId: order.id, status: "CANCELLED" });
        toast.info("Order cancelled.");
        refetch();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleFulfillSubmit = async (payload: FulfillOrderPayload) => {
    await fulfillOrder.mutateAsync(payload);
    toast.success("Order fulfilled and credentials delivered to customer dashboard!");
    refetch();
  };

  const whatsAppLink = generateWhatsAppOrderLink(
    order.customerPhone,
    order.customerName,
    order.orderNumber
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/orders"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} size="sm" />
          </div>
          <p className="text-xs text-slate-500">Created on {formatDate(order.createdAt)}</p>
        </div>

        {/* WhatsApp Deep Link Button */}
        <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="inline-block">
          <Button
            variant="success"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            leftIcon={<MessageCircle className="h-4 w-4" />}
          >
            Message Customer on WhatsApp
          </Button>
        </a>
      </div>

      {/* Admin Action Control Bar */}
      <div className="rounded-3xl border border-purple-200 bg-purple-50/50 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
            Admin Workflow Actions
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Current Status: <strong className="text-slate-900">{order.status}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Approve Payment */}
          {order.status === "PENDING_PAYMENT_VERIFICATION" && (
            <Button
              variant="success"
              size="sm"
              onClick={handleApprove}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Approve Payment
            </Button>
          )}

          {/* Reject Payment */}
          {order.status === "PENDING_PAYMENT_VERIFICATION" && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleReject}
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Reject Payment
            </Button>
          )}

          {/* Mark Processing */}
          {(order.status === "PAYMENT_APPROVED" ||
            order.status === "PENDING_PAYMENT_VERIFICATION") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkProcessing}
              leftIcon={<Clock className="h-4 w-4" />}
            >
              Mark Processing
            </Button>
          )}

          {/* Fulfill Order Modal Button */}
          {order.status !== "CANCELLED" && (
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setIsFulfillModalOpen(true)}
              leftIcon={<UserCheck className="h-4 w-4" />}
            >
              {order.status === "FULFILLED" ? "Update Fulfillment" : "Fulfill Order"}
            </Button>
          )}

          {/* Cancel Order */}
          {order.status !== "CANCELLED" && order.status !== "FULFILLED" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {(
          [
            { id: "OVERVIEW", label: "Overview", icon: <Info className="h-4 w-4" /> },
            { id: "PAYMENT", label: "Payment Verification", icon: <CreditCard className="h-4 w-4" /> },
            { id: "ACCESS", label: "Delivery / Access", icon: <Key className="h-4 w-4" /> },
            { id: "ACTIVATION", label: "Activation Process", icon: <BookOpen className="h-4 w-4" /> },
            { id: "AUDIT", label: "Audit & History", icon: <History className="h-4 w-4" /> },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          {/* If Fulfilled: Show Delivery View */}
          {order.status === "FULFILLED" && (
            <DeliveryCredentialsCard
              deliveryType={order.deliveryType}
              deliveryData={order.deliveryData}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Items & Totals */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                  Purchased Items
                </h3>
                <div className="space-y-3 divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="pt-3 first:pt-0 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.productName}</h4>
                        <p className="text-xs text-blue-600 font-medium mt-0.5">
                          {item.planName} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Customer & Timeline */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                  Customer Details
                </h3>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 font-medium">Name:</span>
                    <p className="font-bold text-slate-800">{order.customerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Email:</span>
                    <p className="font-semibold text-slate-800">{order.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Phone:</span>
                    <p className="font-semibold text-slate-800">{order.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                  Order Status Progress
                </h3>
                <OrderTimeline events={order.timeline || []} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Payment */}
      {activeTab === "PAYMENT" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Manual Payment Verification</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review submitted bKash/Nagad details against merchant transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Payment Channel
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {order.paymentMethod?.displayName || "bKash / Nagad"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Customer Sender Phone
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                {order.senderNumber || order.customerPhone}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Submitted Transaction ID (TrxID)
              </span>
              <p className="text-base font-mono font-black text-purple-900 mt-1">
                {order.transactionId || "N/A"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Required Amount
              </span>
              <p className="text-base font-black text-slate-900 mt-1">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          {order.paymentNote && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Customer Note:</span>
              <p className="text-slate-600 mt-0.5">{order.paymentNote}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            {order.status === "PENDING_PAYMENT_VERIFICATION" && (
              <>
                <Button
                  variant="success"
                  onClick={handleApprove}
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Approve Payment
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Reject Payment
                </Button>
              </>
            )}
            {order.status === "PAYMENT_APPROVED" && (
              <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> Payment Approved
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Delivery / Access */}
      {activeTab === "ACCESS" && (
        <div className="space-y-6">
          <AdminAccessForm orderId={order.id} initialType={order.deliveryType} onSaved={refetch} />
        </div>
      )}

      {/* Tab 4: Activation Process */}
      {activeTab === "ACTIVATION" && (
        <div className="space-y-6">
          <AdminActivationBuilder orderId={order.id} />
        </div>
      )}

      {/* Tab 5: Audit & History */}
      {activeTab === "AUDIT" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Order Event Audit &amp; Timeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete historical record of payments, status updates, and fulfillment.
            </p>
          </div>

          <OrderTimeline events={order.timeline || []} />
        </div>
      )}

      {/* Fulfill Order Modal */}
      <FulfillOrderModal
        isOpen={isFulfillModalOpen}
        onClose={() => setIsFulfillModalOpen(false)}
        onFulfill={handleFulfillSubmit}
        order={order}
      />

      {/* Confirm Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
