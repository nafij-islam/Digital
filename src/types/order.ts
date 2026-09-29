import { DeliveryType } from "./product";
import { PaymentMethod } from "./payment";

export type { DeliveryType };

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING_PAYMENT_VERIFICATION"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "PROCESSING"
  | "FULFILLED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  planId: string;
  planName: string;
  durationValue: number;
  durationUnit: string;
  price: number;
  quantity: number;
}

export interface DeliveryCredentials {
  emailOrUsername?: string;
  password?: string;
  loginUrl?: string;
  licenseKey?: string;
  activationLink?: string;
  downloadUrl?: string;
  instructions?: string;
  notes?: string;
  fulfilledAt?: string;
}

export interface OrderAccessDetails {
  id?: string;
  orderId: string;
  type: DeliveryType;
  publicInstructions?: string;
  loginEmail?: string;
  loginUsername?: string;
  loginPassword?: string;
  loginUrl?: string;
  licenseKey?: string;
  activationLink?: string;
  downloadUrl?: string;
  additionalInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  currency: string;
  
  // Payment info
  paymentMethodId?: string;
  paymentMethod?: PaymentMethod;
  senderNumber?: string;
  transactionId?: string;
  paymentNote?: string;
  paymentSubmittedAt?: string;
  paymentVerifiedAt?: string;
  
  // Order state
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  deliveryType?: DeliveryType;
  deliveryData?: DeliveryCredentials;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    planId: string;
    quantity: number;
  }[];
  couponCode?: string;
  paymentMethodId: string;
  senderNumber: string;
  transactionId: string;
  paymentNote?: string;
  acceptTerms: boolean;
}

export interface FulfillOrderPayload {
  orderId: string;
  deliveryType: DeliveryType;
  emailOrUsername?: string;
  password?: string;
  loginUrl?: string;
  licenseKey?: string;
  activationLink?: string;
  downloadUrl?: string;
  instructions?: string;
  notes?: string;
}
