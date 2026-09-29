export type PaymentProvider = "bkash" | "nagad" | "rocket" | "upay" | "manual";

export type AccountType = "Personal" | "Merchant" | "Agent";

export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  displayName: string;
  paymentNumber: string;
  accountType: AccountType;
  instructions: string;
  qrCodeUrl?: string;
  feePercentage?: number;
  active: boolean;
  sortOrder: number;
}

export interface PaymentVerificationInput {
  orderId: string;
  paymentMethodId: string;
  senderNumber: string;
  transactionId: string;
  paymentNote?: string;
}
