"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminProducts } from "@/hooks/useAdmin";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils/formatters";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await adminService.deleteProduct(id);
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        toast.success(`Deleted product: ${name}`);
      } catch {
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await adminService.updateProduct(id, { isActive: !current });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product state updated.");
    } catch {
      toast.error("Failed to update product state.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage digital products, multi-tier pricing plans, and stock availability.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="gradient" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by title or category..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading products..." size="md" className="py-16" />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-4 sm:p-6 shadow-soft overflow-hidden">
          {/* Mobile Stacked Cards (< md) */}
          <div className="space-y-3.5 md:hidden">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200/80">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold text-[10px] border border-purple-200">
                        {product.category?.name || "Category"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {product.plans?.length || 0} plans
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--bg-base)] border border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Starting Price</span>
                    <span className="font-black text-slate-900">{formatPrice(product.startingPrice)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(product.id, product.isActive)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      product.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {product.isActive ? "Active" : "Disabled"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href={`/admin/products/${product.id}/edit`} className="block w-full">
                    <Button variant="secondary" size="sm" className="w-full h-10 text-xs font-bold justify-center">
                      <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-10 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/60 justify-center"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Delivery Type</th>
                  <th className="pb-3">Plans</th>
                  <th className="pb-3">Starting Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{product.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            /{product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold text-[11px] border border-purple-200">
                        {product.category?.name || "Category"}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600 font-mono text-[11px]">
                      {product.deliveryType}
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-slate-900">
                        {product.plans?.length || 0} plans
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      {formatPrice(product.startingPrice)}
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {product.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="secondary" size="sm" className="text-xs h-7 px-2.5">
                          <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2 text-rose-600 hover:bg-rose-50"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
