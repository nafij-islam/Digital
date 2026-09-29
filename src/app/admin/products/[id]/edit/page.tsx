"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { ProductForm } from "@/components/admin/ProductForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminService.getProducts(),
  });

  const product = products.find((p) => p.id === id || p.slug === id);

  if (isLoading) {
    return <LoadingSpinner text="Loading product details..." size="lg" className="py-24" />;
  }

  if (!product) {
    return (
      <ErrorState
        title="Product Not Found"
        message="Could not locate the product to edit."
        onRetry={() => router.push("/admin/products")}
      />
    );
  }

  const handleSave = async (data: Partial<Product>) => {
    await adminService.updateProduct(product.id, data);
  };

  return <ProductForm initialProduct={product} onSave={handleSave} isEditing={true} />;
}
