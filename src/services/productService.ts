import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Product, ProductFilterParams } from "@/types/product";
import { INITIAL_PRODUCTS } from "./mockData";

export function normalizeBackendProduct(p: any): Product {
  const plans = (p.plans || []).map((pl: any) => {
    const rawReg = pl.regularPrice;
    const rawSale = pl.salePrice;
    const regularPrice =
      typeof rawReg === "number" && rawReg > 1000
        ? Math.round(rawReg / 100)
        : rawReg || 0;
    const salePrice =
      typeof rawSale === "number" && rawSale > 0
        ? rawSale > 1000
          ? Math.round(rawSale / 100)
          : rawSale
        : regularPrice;

    return {
      id: pl._id?.toString() || pl.id,
      productId: pl.productId?.toString() || p._id?.toString() || p.id,
      name: pl.name,
      durationValue: pl.durationValue,
      durationUnit: pl.durationUnit,
      regularPrice,
      salePrice,
      stock: pl.stock ?? 0,
      unlimitedStock: pl.unlimitedStock ?? true,
      active: pl.active ?? true,
      isPopular: pl.isPopular ?? false,
      sortOrder: pl.sortOrder || 0,
    };
  });

  const prices = plans
    .map((pl: any) => pl.salePrice ?? pl.regularPrice)
    .filter((pr: number) => pr > 0);
  const startingPrice =
    prices.length > 0
      ? Math.min(...prices)
      : typeof p.startingPrice === "number"
      ? p.startingPrice
      : 0;

  const regularPrices = plans
    .map((pl: any) => pl.regularPrice)
    .filter((pr: number) => pr > 0);
  const originalPrice =
    regularPrices.length > 0 ? Math.max(...regularPrices) : undefined;

  const discountPercentage =
    originalPrice && startingPrice && originalPrice > startingPrice
      ? Math.round(((originalPrice - startingPrice) / originalPrice) * 100)
      : undefined;

  const categoryId =
    typeof p.categoryId === "object" && p.categoryId !== null
      ? p.categoryId._id?.toString() || p.categoryId.id
      : p.categoryId?.toString() || "";

  const category =
    typeof p.categoryId === "object" && p.categoryId !== null
      ? {
          id: p.categoryId._id?.toString() || p.categoryId.id,
          name: p.categoryId.name,
          slug: p.categoryId.slug,
          active: true,
          sortOrder: 0,
        }
      : p.category;

  const imageUrl =
    p.thumbnail?.secureUrl ||
    p.thumbnail?.url ||
    p.imageUrl ||
    p.gallery?.[0]?.secureUrl ||
    p.gallery?.[0]?.url ||
    "";

  return {
    id: p._id?.toString() || p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription || "",
    description: p.description || "",
    categoryId,
    category,
    imageUrl,
    isFeatured: p.featured ?? p.isFeatured ?? false,
    isPopular: p.popular ?? p.isPopular ?? false,
    isActive: p.active ?? p.isActive ?? true,
    deliveryType: p.deliveryType || "ACCOUNT_CREDENTIAL",
    features: p.features || [],
    deliveryInfo: p.deliveryInformation || p.deliveryInfo || "Instant digital delivery",
    importantNotes: p.importantNotes || "",
    plans,
    startingPrice,
    originalPrice,
    discountPercentage,
    rating: p.rating || 5.0,
    ratingCount: p.ratingCount || 18,
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
}

export const productService = {
  getProducts: async (params?: ProductFilterParams): Promise<{ products: Product[]; total: number }> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.LIST, { params });
      const resData = response.data;
      const rawProducts = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData?.products)
        ? resData.products
        : Array.isArray(resData)
        ? resData
        : [];

      if (rawProducts.length > 0) {
        return {
          products: rawProducts.map(normalizeBackendProduct),
          total: resData?.pagination?.total ?? rawProducts.length,
        };
      }
      throw new Error("No products returned");
    } catch {
      let list = [...INITIAL_PRODUCTS];

      if (params?.category) {
        list = list.filter(
          (p) =>
            p.category?.slug === params.category ||
            p.categoryId === params.category
        );
      }

      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            p.features.some((f) => f.toLowerCase().includes(query))
        );
      }

      if (params?.isFeatured !== undefined) {
        list = list.filter((p) => p.isFeatured === params.isFeatured);
      }

      if (params?.isPopular !== undefined) {
        list = list.filter((p) => p.isPopular === params.isPopular);
      }

      if (params?.hasDiscount) {
        list = list.filter((p) => (p.discountPercentage ?? 0) > 0);
      }

      if (params?.sortBy) {
        switch (params.sortBy) {
          case "price_asc":
            list.sort((a, b) => a.startingPrice - b.startingPrice);
            break;
          case "price_desc":
            list.sort((a, b) => b.startingPrice - a.startingPrice);
            break;
          case "rating":
            list.sort((a, b) => b.rating - a.rating);
            break;
          case "newest":
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          default:
            list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }
      }

      return {
        products: list,
        total: list.length,
      };
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.DETAILS(slug));
      const resData = response.data;
      const rawProduct = resData?.data || (resData?.name ? resData : null);
      if (rawProduct) {
        return normalizeBackendProduct(rawProduct);
      }
      throw new Error("Product not found");
    } catch {
      const found = INITIAL_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
      return found || null;
    }
  },

  getDeals: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.DEALS);
      const resData = response.data;
      const rawProducts = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : [];
      if (rawProducts.length > 0) {
        return rawProducts.map(normalizeBackendProduct);
      }
      return INITIAL_PRODUCTS.filter((p) => (p.discountPercentage ?? 0) >= 40);
    } catch {
      return INITIAL_PRODUCTS.filter((p) => (p.discountPercentage ?? 0) >= 40);
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.FEATURED);
      const resData = response.data;
      const rawProducts = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : [];
      if (rawProducts.length > 0) {
        return rawProducts.map(normalizeBackendProduct);
      }
      return INITIAL_PRODUCTS.filter((p) => p.isFeatured);
    } catch {
      return INITIAL_PRODUCTS.filter((p) => p.isFeatured);
    }
  },
};
