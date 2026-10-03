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
    bgColor: "bg-[#29294D]",
    textColor: "text-[#E5A84B]",
    borderColor: "border-[#353560]/60",
    description: "Waiting for customer to submit payment proof.",
  },
  PENDING_PAYMENT_VERIFICATION: {
    label: "Pending Verification",
    variant: "purple",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#716DFF]",
    borderColor: "border-[#5754D8]/50",
    description: "Payment proof submitted, waiting for admin approval.",
  },
  PAYMENT_APPROVED: {
    label: "Payment Approved",
    variant: "info",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#6CD6B3]",
    borderColor: "border-[#6CD6B3]/40",
    description: "Payment verified. Preparing your order for processing.",
  },
  PAYMENT_REJECTED: {
    label: "Payment Rejected",
    variant: "danger",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#EF7B98]",
    borderColor: "border-[#EF7B98]/40",
    description: "Payment could not be verified. Please check Transaction ID or contact support.",
  },
  PROCESSING: {
    label: "Processing",
    variant: "info",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#716DFF]",
    borderColor: "border-[#5754D8]/50",
    description: "Your digital license / account is being prepared.",
  },
  FULFILLED: {
    label: "Fulfilled / Delivered",
    variant: "success",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#6CD6B3]",
    borderColor: "border-[#6CD6B3]/40",
    description: "Order completed. Access credentials/license in your delivery area.",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "slate",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#777790]",
    borderColor: "border-[#353560]/40",
    description: "Order has been cancelled.",
  },
  REFUNDED: {
    label: "Refunded",
    variant: "warning",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#EF7B98]",
    borderColor: "border-[#EF7B98]/40",
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
    bgColor: "bg-[#29294D]",
    textColor: "text-[#6CD6B3]",
    borderColor: "border-[#6CD6B3]/40",
  },
  EXPIRING_SOON: {
    label: "Expiring Soon",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#E5A84B]",
    borderColor: "border-[#E5A84B]/40",
  },
  EXPIRED: {
    label: "Expired",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#EF7B98]",
    borderColor: "border-[#EF7B98]/40",
  },
  CANCELLED: {
    label: "Cancelled",
    bgColor: "bg-[#29294D]",
    textColor: "text-[#777790]",
    borderColor: "border-[#353560]/40",
  },
};
