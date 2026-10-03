import { Category } from "@/types/product";
import { INITIAL_CATEGORIES } from "./mockData";

const CATEGORIES_KEY = "dg_local_categories";

export function getLocalCategories(): Category[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveLocalCategories(categories: Category[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error("Failed to save local categories", e);
  }
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    return getLocalCategories();
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    const categories = getLocalCategories();
    const found = categories.find((cat) => cat.slug === slug || cat.id === slug);
    return found || null;
  },
};
