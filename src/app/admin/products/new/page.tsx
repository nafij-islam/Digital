"use client";

import React from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminService } from "@/services/adminService";
import { Product } from "@/types/product";

export default function NewProductPage() {
  const handleSave = async (data: Partial<Product>) => {
    await adminService.createProduct(data);
  };

  return <ProductForm onSave={handleSave} />;
}
