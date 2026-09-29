"use client";

import React, { useState } from "react";
import { useAdminCoupons } from "@/hooks/useAdmin";
import { adminService } from "@/services/adminService";
import { Coupon } from "@/types/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Tag, Trash2, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";

export default function AdminCouponsPage() {
  const { data: coupons = [], isLoading } = useAdminCoupons();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      await adminService.createCoupon({
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderAmount,
        active: true,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success(`Coupon ${code.toUpperCase()} created!`);
      setIsModalOpen(false);
      setCode("");
      setDescription("");
    } catch {
      toast.error("Failed to create coupon.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Coupons &amp; Promo Codes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create discount promo codes for flash campaigns and customer loyalty.
          </p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create Coupon
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading coupons..." size="md" className="py-16" />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Promo Code</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Discount</th>
                  <th className="pb-3">Min Order</th>
                  <th className="pb-3">Times Used</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/50">
                    <td className="py-4">
                      <span className="font-mono font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600">{coupon.description || "—"}</td>
                    <td className="py-4 font-bold text-slate-900">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% OFF`
                        : `${formatPrice(coupon.discountValue)} Flat`}
                    </td>
                    <td className="py-4 text-slate-600">
                      {coupon.minOrderAmount ? formatPrice(coupon.minOrderAmount) : "None"}
                    </td>
                    <td className="py-4 font-bold text-slate-900">
                      {coupon.usedCount} times
                    </td>
                    <td className="py-4 text-right">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Promo Coupon"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Coupon Code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. SAVE20"
          />

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 20% discount on all products"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Discount Type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              options={[
                { value: "percentage", label: "Percentage (%)" },
                { value: "fixed", label: "Fixed Amount (৳)" },
              ]}
            />

            <Input
              label="Discount Value"
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
            />
          </div>

          <Input
            label="Minimum Order Subtotal (৳)"
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(Number(e.target.value))}
          />

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
