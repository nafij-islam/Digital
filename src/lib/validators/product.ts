import { z } from "zod";

export const planSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Plan name is required"),
  durationValue: z.coerce.number().min(1, "Duration must be at least 1"),
  durationUnit: z.enum(["days", "months", "years", "lifetime"]),
  regularPrice: z.coerce.number().min(0, "Regular price must be >= 0"),
  salePrice: z.coerce.number().min(0, "Sale price must be >= 0"),
  stock: z.coerce.number().default(-1),
  active: z.boolean().default(true),
  isPopular: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().default(0),
  features: z.array(z.string()).optional().default([]),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  shortDescription: z.string().min(10, "Short description must be at least 10 chars"),
  description: z.string().min(20, "Full description must be at least 20 chars"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Valid image URL is required").or(z.string().min(1)),
  badge: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  deliveryType: z.enum([
    "ACTIVATION_LINK",
    "LICENSE_KEY",
    "ACCOUNT_CREDENTIAL",
    "TEXT_INSTRUCTION",
    "DOWNLOAD_LINK",
    "OTHER",
  ]),
  features: z.array(z.string()).min(1, "Add at least one key feature"),
  deliveryInfo: z.string().min(5, "Delivery instructions / info required"),
  importantNotes: z.string().optional(),
  plans: z.array(planSchema).min(1, "At least one plan is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type PlanFormData = z.infer<typeof planSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
