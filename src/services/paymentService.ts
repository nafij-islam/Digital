import { PaymentMethod, PaymentVerificationInput } from "@/types/payment";
import { INITIAL_PAYMENT_METHODS } from "./mockData";
import { getLocalOrders, saveLocalOrders } from "./orderService";

const ADMIN_PAYMENT_METHODS_KEY = "dg_local_pm";

export const paymentService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    let methods = INITIAL_PAYMENT_METHODS;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(ADMIN_PAYMENT_METHODS_KEY);
        if (stored) methods = JSON.parse(stored);
      } catch {
        methods = INITIAL_PAYMENT_METHODS;
      }
    }
    return methods.filter((m) => m.active);
  },

  submitPaymentVerification: async (
    payload: PaymentVerificationInput
  ): Promise<{ success: boolean; message: string }> => {
    if (payload.orderId) {
      const orders = getLocalOrders();
      const index = orders.findIndex((o) => o.id === payload.orderId);
      if (index !== -1) {
        const now = new Date().toISOString();
        orders[index] = {
          ...orders[index],
          paymentMethodId: payload.paymentMethodId,
          senderNumber: payload.senderNumber,
          transactionId: payload.transactionId,
          paymentNote: payload.paymentNote,
          paymentSubmittedAt: now,
          status: "PENDING_PAYMENT_VERIFICATION",
          timeline: orders[index].timeline.map((t) => {
            if (t.status === "PENDING_PAYMENT_VERIFICATION") {
              return {
                ...t,
                completed: true,
                timestamp: now,
                description: `Payment TrxID ${payload.transactionId} submitted for verification.`,
              };
            }
            return t;
          }),
        };
        saveLocalOrders(orders);
      }
    }

    return {
      success: true,
      message: "Payment information submitted successfully. Awaiting verification.",
    };
  },
};
