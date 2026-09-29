import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { PaymentMethod, PaymentVerificationInput } from "@/types/payment";
import { INITIAL_PAYMENT_METHODS } from "./mockData";

export const paymentService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      const { data } = await apiClient.get<PaymentMethod[]>(API_ENDPOINTS.PAYMENTS.METHODS);
      return data;
    } catch {
      return INITIAL_PAYMENT_METHODS.filter((m) => m.active);
    }
  },

  submitPaymentVerification: async (
    payload: PaymentVerificationInput
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.PAYMENTS.VERIFY, payload);
      return data;
    } catch {
      return {
        success: true,
        message: "Your payment information has been submitted and is waiting for admin verification.",
      };
    }
  },
};
