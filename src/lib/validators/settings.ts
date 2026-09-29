import { z } from "zod";

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  tagline: z.string().min(2, "Tagline is required"),
  logoUrl: z.string().optional(),
  supportEmail: z.string().email("Valid support email is required"),
  supportPhone: z.string().min(10, "Support phone is required"),
  whatsappNumber: z.string().min(10, "WhatsApp number is required"),
  currency: z.string().min(1, "Currency code is required (e.g. BDT)"),
  currencySymbol: z.string().min(1, "Currency symbol is required (e.g. ৳)"),
  orderPrefix: z.string().min(1, "Order prefix is required (e.g. DIGI-)"),
  paymentInstructions: z.string().min(10, "Payment instructions required"),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  telegramUrl: z.string().url().optional().or(z.literal("")),
  discordUrl: z.string().url().optional().or(z.literal("")),
  seoTitle: z.string().min(2, "SEO title is required"),
  seoDescription: z.string().min(10, "SEO description is required"),
  termsUrl: z.string().optional(),
  privacyUrl: z.string().optional(),
});

export const paymentMethodSchema = z.object({
  provider: z.enum(["bkash", "nagad", "rocket", "upay", "manual"]),
  displayName: z.string().min(2, "Display name is required"),
  paymentNumber: z.string().min(11, "Valid phone/merchant number is required"),
  accountType: z.enum(["Personal", "Merchant", "Agent"]),
  instructions: z.string().min(5, "Instructions required"),
  qrCodeUrl: z.string().optional(),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 chars").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(1, "Discount value must be > 0"),
  minOrderAmount: z.coerce.number().optional().default(0),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  expiryDate: z.string().optional(),
  active: z.boolean().default(true),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
