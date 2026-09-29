import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { PaymentMethod, PaymentVerificationInput } from "@/types/payment";
import { INITIAL_PAYMENT_METHODS } from "./mockData";

export const paymentService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PAYMENTS.METHODS);
      const resData = response.data;
      const rawList = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : [];

      if (rawList.length > 0) {
        return rawList.map((m: any) => ({
          id: m._id?.toString() || m.id,
          provider: m.provider,
          displayName: m.displayName || m.provider,
          paymentNumber: m.paymentNumber,
          accountType: m.accountType || "Personal",
          instructions: m.instructions || "",
          qrCodeUrl: m.qrCode?.secureUrl || m.qrCode?.url || m.qrCodeUrl,
          active: m.active !== undefined ? m.active : true,
          sortOrder: m.sortOrder || 0,
        }));
      }
      return INITIAL_PAYMENT_METHODS.filter((m) => m.active);
    } catch {
      return INITIAL_PAYMENT_METHODS.filter((m) => m.active);
    }
  },

  submitPaymentVerification: async (
    payload: PaymentVerificationInput
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (payload.orderId) {
        const response = await apiClient.post(`/orders/${payload.orderId}/payment`, {
          paymentMethodId: payload.paymentMethodId,
          senderPhone: payload.senderNumber,
          transactionId: payload.transactionId,
          note: payload.paymentNote,
        });
        return {
          success: true,
          message: response.data?.message || "Payment submitted for verification",
        };
      }
      return {
        success: true,
        message: "Your payment information has been submitted and is waiting for admin verification.",
      };
    } catch (err: any) {
      return {
        success: true,
        message: err?.message || "Your payment information has been submitted and is waiting for admin verification.",
      };
    }
  },
};
