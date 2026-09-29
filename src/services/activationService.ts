import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ActivationProcess } from "@/types/activation";

export const activationService = {
  // Customer: get activation process for an order
  getCustomerActivationProcess: async (orderId: string): Promise<ActivationProcess | null> => {
    try {
      const { data } = await apiClient.get<ActivationProcess>(
        API_ENDPOINTS.ORDERS.ACTIVATION_PROCESS(orderId)
      );
      return data;
    } catch {
      return null;
    }
  },

  // Admin: get activation process
  getAdminActivationProcess: async (orderId: string): Promise<ActivationProcess | null> => {
    try {
      const { data } = await apiClient.get<ActivationProcess>(
        API_ENDPOINTS.ADMIN.ORDERS.ACTIVATION_PROCESS(orderId)
      );
      return data;
    } catch {
      return null;
    }
  },

  // Admin: create or update activation process
  saveAdminActivationProcess: async (
    orderId: string,
    payload: {
      title?: string;
      subtitle?: string;
      blocks: ActivationProcess["blocks"];
    }
  ): Promise<ActivationProcess> => {
    const { data } = await apiClient.put<ActivationProcess>(
      API_ENDPOINTS.ADMIN.ORDERS.ACTIVATION_PROCESS(orderId),
      payload
    );
    return data;
  },
};
