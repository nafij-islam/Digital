"use client";

import React, { useState } from "react";
import { useAdminPaymentMethods } from "@/hooks/useAdmin";
import { adminService } from "@/services/adminService";
import { PaymentMethod } from "@/types/payment";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { Sliders, Edit2, Smartphone, CheckCircle2 } from "lucide-react";

export default function AdminPaymentMethodsPage() {
  const { data: methods = [], isLoading } = useAdminPaymentMethods();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [accountType, setAccountType] = useState<"Personal" | "Merchant" | "Agent">("Personal");
  const [instructions, setInstructions] = useState("");
  const [active, setActive] = useState(true);

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setDisplayName(method.displayName);
    setPaymentNumber(method.paymentNumber);
    setAccountType(method.accountType);
    setInstructions(method.instructions);
    setActive(method.active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod) return;

    try {
      await adminService.updatePaymentMethod(editingMethod.id, {
        displayName,
        paymentNumber,
        accountType,
        instructions,
        active,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-payment-methods"] });
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method settings updated!");
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to update payment method.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Payment Methods Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure dynamic bKash and Nagad numbers, account types, and instructions shown at customer checkout.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading payment methods..." size="md" className="py-16" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methods.map((method) => {
            const isBkash = method.provider === "bkash";
            const isNagad = method.provider === "nagad";

            return (
              <div
                key={method.id}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-xs uppercase text-white shadow-xs ${
                          isBkash
                            ? "bg-gradient-to-tr from-pink-600 to-rose-500"
                            : isNagad
                            ? "bg-gradient-to-tr from-orange-600 to-amber-500"
                            : "bg-slate-800"
                        }`}
                      >
                        {method.provider}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {method.displayName}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">
                          {method.accountType} Transfer
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        method.active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {method.active ? "Active" : "Disabled"}
                    </span>
                  </div>

                  {/* Payment Number Display */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Configured Payment Number
                    </span>
                    <div className="text-lg font-black font-mono tracking-wider text-slate-900">
                      {method.paymentNumber}
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Checkout Instructions
                    </span>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {method.instructions}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(method)}
                    leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                  >
                    Edit Configuration
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Payment Method Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure ${editingMethod?.displayName}`}
        description="Update the merchant/personal payment number and customer instructions."
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Display Name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Payment / Merchant Number"
              required
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              placeholder="017XXXXXXXX"
            />

            <Select
              label="Account Type"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as any)}
              options={[
                { value: "Personal", label: "Personal (Send Money)" },
                { value: "Merchant", label: "Merchant (Payment)" },
                { value: "Agent", label: "Agent (Cash Out)" },
              ]}
            />
          </div>

          <Textarea
            label="Step-by-Step Payment Instructions"
            required
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="1. Dial *247# or open App...&#10;2. Select Send Money..."
          />

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-slate-300 text-primary-600"
            />
            <span>Active on Checkout</span>
          </label>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save Configuration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
