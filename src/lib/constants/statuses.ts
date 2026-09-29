import { OrderStatus } from "@/types/order";
import { SubscriptionStatus } from "@/types/subscription";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    variant: "warning" | "info" | "success" | "danger" | "purple" | "slate";
    bgColor: string;
    textColor: string;
    borderColor: string;
    description: string;
  }
> = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    variant: "warning",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    description: "Waiting for customer to submit payment proof.",
  },
  PENDING_PAYMENT_VERIFICATION: {
    label: "Pending Verification",
    variant: "purple",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    description: "Payment proof submitted, waiting for admin approval.",
  },
  PAYMENT_APPROVED: {
    label: "Payment Approved",
    variant: "info",
    bgColor: "bg-sky-50",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
    description: "Payment verified. Preparing your order for processing.",
  },
  PAYMENT_REJECTED: {
    label: "Payment Rejected",
    variant: "danger",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    description: "Payment could not be verified. Please check Transaction ID or contact support.",
  },
  PROCESSING: {
    label: "Processing",
    variant: "info",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    description: "Your digital license / account is being prepared.",
  },
  FULFILLED: {
    label: "Fulfilled / Delivered",
    variant: "success",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    description: "Order completed. Access credentials/license in your delivery area.",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "slate",
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
    description: "Order has been cancelled.",
  },
  REFUNDED: {
    label: "Refunded",
    variant: "warning",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    description: "Amount refunded to customer.",
  },
};

export const SUBSCRIPTION_STATUS_CONFIG: Record<
  SubscriptionStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  EXPIRING_SOON: {
    label: "Expiring Soon",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  EXPIRED: {
    label: "Expired",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  CANCELLED: {
    label: "Cancelled",
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
  },
};
