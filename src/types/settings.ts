export interface CloudinaryImage {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface HomepageSetting {
  heroImage?: CloudinaryImage;
  heroImageAlt?: string;
  heroImageFit?: "cover" | "contain";
  heroImageEnabled?: boolean;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
  orderPrefix: string;
  paymentInstructions: string;
  facebookUrl?: string;
  telegramUrl?: string;
  discordUrl?: string;
  seoTitle: string;
  seoDescription: string;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiryDate?: string;
  active: boolean;
}

export interface SiteAppearanceSetting {
  backgroundColor: string;
  surfaceColor: string;
  primaryColor: string;
  secondaryColor: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_SITE_APPEARANCE: SiteAppearanceSetting = {
  backgroundColor: "#F3F5F9",
  surfaceColor: "#FFFFFF",
  primaryColor: "#356DF3",
  secondaryColor: "#7548F5",
};
