import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ProductFilterParams } from "@/types/product";

export function useProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 3, // 3 mins
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useDeals() {
  return useQuery({
    queryKey: ["deals"],
    queryFn: () => productService.getDeals(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productService.getFeatured(),
    staleTime: 1000 * 60 * 5,
  });
}
