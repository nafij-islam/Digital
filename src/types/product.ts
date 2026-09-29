export type DurationUnit = "days" | "months" | "years" | "lifetime";

export interface ProductPlan {
  id: string;
  productId: string;
  name: string; // e.g. "1 Month Solo", "12 Months Family"
  durationValue: number; // e.g. 1, 3, 6, 12
  durationUnit: DurationUnit; // 'months', 'years', etc.
  regularPrice: number;
  salePrice: number;
  stock: number; // 0 for out of stock, -1 for unlimited
  active: boolean;
  isPopular?: boolean;
  sortOrder: number;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  productCount?: number;
  active: boolean;
  sortOrder: number;
}

export type DeliveryType =
  | "ACTIVATION_LINK"
  | "LICENSE_KEY"
  | "ACCOUNT_CREDENTIAL"
  | "TEXT_INSTRUCTION"
  | "DOWNLOAD_LINK"
  | "OTHER";

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isVerifiedPurchase?: boolean;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  category?: Category;
  imageUrl: string;
  badge?: string; // e.g. "Best Seller", "Hot", "Instant"
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  deliveryType: DeliveryType;
  features: string[];
  deliveryInfo: string;
  importantNotes?: string;
  faqs?: ProductFAQ[];
  plans: ProductPlan[];
  startingPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  ratingCount: number;
  reviews?: ProductReview[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  hasDiscount?: boolean;
  sortBy?: "featured" | "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  limit?: number;
}
