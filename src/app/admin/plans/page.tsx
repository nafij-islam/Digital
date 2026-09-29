"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminProducts } from "@/hooks/useAdmin";
import { formatPrice, formatDuration } from "@/lib/utils/formatters";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Layers, Edit2, ExternalLink } from "lucide-react";

export default function AdminPlansPage() {
  const { data: products = [], isLoading } = useAdminProducts();

  const allPlans = products.flatMap((p) =>
    (p.plans || []).map((plan) => ({
      ...plan,
      productName: p.name,
      productSlug: p.slug,
      productId: p.id,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Subscription Plans Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all dynamic duration tiers and price points configured across products.
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading plans..." size="md" className="py-16" />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Plan Name</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Regular Price</th>
                  <th className="pb-3">Sale Price</th>
                  <th className="pb-3">Stock State</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {allPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/50">
                    <td className="py-4 font-bold text-slate-900">
                      {plan.productName}
                    </td>
                    <td className="py-4 font-semibold text-primary-600">
                      {plan.name}
                    </td>
                    <td className="py-4 text-slate-600">
                      {formatDuration(plan.durationValue, plan.durationUnit)}
                    </td>
                    <td className="py-4 text-slate-400 line-through">
                      {formatPrice(plan.regularPrice)}
                    </td>
                    <td className="py-4 font-black text-slate-900 text-sm">
                      {formatPrice(plan.salePrice)}
                    </td>
                    <td className="py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                        {plan.stock === -1 ? "Unlimited" : `${plan.stock} available`}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/admin/products/${plan.productId}/edit`}>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                          <Edit2 className="h-3 w-3 mr-1" /> Edit in Product
                        </Button>
                      </Link>
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
