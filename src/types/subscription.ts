import { DeliveryCredentials } from "./order";

export type SubscriptionStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "CANCELLED";

export interface UserSubscription {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
  deliveryData?: DeliveryCredentials;
  autoRenewAvailable?: boolean;
}
