import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Product, ProductFilterParams } from "@/types/product";
import { INITIAL_PRODUCTS } from "./mockData";

export const productService = {
  getProducts: async (params?: ProductFilterParams): Promise<{ products: Product[]; total: number }> => {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
      return data;
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
      const { data } = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAILS(slug));
      return data;
    } catch {
      const found = INITIAL_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
      return found || null;
    }
  },

  getDeals: async (): Promise<Product[]> => {
    try {
      const { data } = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.DEALS);
      return data;
    } catch {
      return INITIAL_PRODUCTS.filter((p) => (p.discountPercentage ?? 0) >= 40);
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const { data } = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.FEATURED);
      return data;
    } catch {
      return INITIAL_PRODUCTS.filter((p) => p.isFeatured);
    }
  },
};
