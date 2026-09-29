import { UserSubscription } from "@/types/subscription";

export const subscriptionService = {
  getSubscriptions: async (): Promise<UserSubscription[]> => {
    return [];
  },

  renewSubscription: async (_id: string): Promise<{ success: boolean; message: string; orderId?: string }> => {
    return {
      success: true,
      message: "Please create a new order for your desired product and plan duration.",
    };
  },
};
