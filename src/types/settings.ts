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

export type ProductCardHeightMode = "AUTO" | "COMPACT" | "CUSTOM";

export interface SiteAppearanceSetting {
  backgroundColor: string;
  surfaceColor: string;
  primaryColor: string;
  secondaryColor: string;
  uiFont: string;
  headingFont: string;
  bodyFont: string;
  productCardHeightMode: ProductCardHeightMode;
  productCardHeight: number;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_SITE_APPEARANCE: SiteAppearanceSetting = {
  backgroundColor: "#0B0F19",
  surfaceColor: "#141A2E",
  primaryColor: "#6366F1",
  secondaryColor: "#818CF8",
  uiFont: "plus-jakarta-sans",
  headingFont: "plus-jakarta-sans",
  bodyFont: "plus-jakarta-sans",
  productCardHeightMode: "COMPACT",
  productCardHeight: 400,
};

export interface FontOption {
  id: string;
  name: string;
  category: "sans" | "serif" | "display" | "handwriting";
  isHeadingOnly?: boolean;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "manrope", name: "Manrope", category: "sans" },
  { id: "plus-jakarta-sans", name: "Plus Jakarta Sans", category: "sans" },
  { id: "inter", name: "Inter", category: "sans" },
  { id: "poppins", name: "Poppins", category: "sans" },
  { id: "dm-sans", name: "DM Sans", category: "sans" },
  { id: "outfit", name: "Outfit", category: "sans" },
  { id: "sora", name: "Sora", category: "sans" },
  { id: "space-grotesk", name: "Space Grotesk", category: "sans" },
  { id: "montserrat", name: "Montserrat", category: "sans" },
  { id: "urbanist", name: "Urbanist", category: "sans" },
  { id: "rubik", name: "Rubik", category: "sans" },
  { id: "nunito-sans", name: "Nunito Sans", category: "sans" },
  { id: "roboto", name: "Roboto", category: "sans" },
  { id: "lato", name: "Lato", category: "sans" },
  { id: "open-sans", name: "Open Sans", category: "sans" },
  { id: "work-sans", name: "Work Sans", category: "sans" },
  { id: "source-sans-3", name: "Source Sans 3", category: "sans" },
  { id: "figtree", name: "Figtree", category: "sans" },
  { id: "lexend", name: "Lexend", category: "sans" },
  { id: "geist", name: "Geist", category: "sans" },
  { id: "bebas-neue", name: "Bebas Neue", category: "display", isHeadingOnly: true },
  { id: "oswald", name: "Oswald", category: "display", isHeadingOnly: true },
  { id: "archivo", name: "Archivo", category: "sans" },
  { id: "barlow-condensed", name: "Barlow Condensed", category: "display", isHeadingOnly: true },
  { id: "playfair-display", name: "Playfair Display", category: "serif", isHeadingOnly: true },
  { id: "merriweather", name: "Merriweather", category: "serif" },
  { id: "rock-salt", name: "Rock Salt", category: "handwriting", isHeadingOnly: true },
];
