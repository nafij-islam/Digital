import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 characters)"),
  email: z.string().email("Valid email address is required"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^[0-9+-\s()]{10,20}$/, "Invalid phone format"),
  paymentMethodId: z.string().min(1, "Please select a payment method"),
  senderNumber: z
    .string()
    .min(11, "Enter the sender mobile number (e.g., 017XXXXXXXX)")
    .max(15, "Invalid phone number length"),
  transactionId: z
    .string()
    .min(6, "Transaction ID (TrxID) is required")
    .max(40, "Transaction ID seems too long")
    .transform((val) => val.trim().toUpperCase()),
  paymentNote: z.string().max(300, "Note is too long").optional(),
  couponCode: z.string().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms of service and delivery policy" }),
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
