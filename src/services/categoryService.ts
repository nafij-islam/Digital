import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Category } from "@/types/product";
import { INITIAL_CATEGORIES } from "./mockData";

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const { data } = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST);
      return data;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const { data } = await apiClient.get<Category>(API_ENDPOINTS.CATEGORIES.DETAILS(slug));
      return data;
    } catch {
      const found = INITIAL_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
      return found || null;
    }
  },
};
