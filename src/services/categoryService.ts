import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Category } from "@/types/product";
import { INITIAL_CATEGORIES } from "./mockData";

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.CATEGORIES.LIST);
      const resData = response.data;
      const rawList = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : [];

      if (rawList.length > 0) {
        return rawList.map((c: any) => ({
          id: c._id?.toString() || c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          icon: c.icon,
          color: c.color,
          active: c.active !== undefined ? c.active : true,
          sortOrder: c.sortOrder || 0,
        }));
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.CATEGORIES.DETAILS(slug));
      const resData = response.data;
      const c = resData?.data || (resData?.name ? resData : null);
      if (c) {
        return {
          id: c._id?.toString() || c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          icon: c.icon,
          color: c.color,
          active: c.active !== undefined ? c.active : true,
          sortOrder: c.sortOrder || 0,
        };
      }
      const found = INITIAL_CATEGORIES.find((cat) => cat.slug === slug || cat.id === slug);
      return found || null;
    } catch {
      const found = INITIAL_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
      return found || null;
    }
  },
};
