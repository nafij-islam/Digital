"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { StoreSettings } from "@/types/settings";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Settings, CheckCircle2, ShieldCheck } from "lucide-react";
import { AdminHeroVisualSetting } from "@/components/admin/AdminHeroVisualSetting";

export default function AdminSettingsPage() {
  const toast = useToast();
  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => settingsService.getSettings(),
  });

  const [form, setForm] = useState<StoreSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "homepage">("general");

  useEffect(() => {
    if (initialSettings) {
      setForm(initialSettings);
    }
  }, [initialSettings]);

  if (isLoading || !form) {
    return <LoadingSpinner text="Loading store settings..." size="md" className="py-24" />;
  }

  const handleChange = (field: keyof StoreSettings, val: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: val } : null));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSaving(true);
    try {
      await settingsService.updateSettings(form);
      toast.success("Store configuration settings saved successfully!");
    } catch {
      toast.error("Failed to update store settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Store &amp; Marketplace Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure store branding, hero visual, support contacts, and payment defaults.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "general"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            General Store
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("homepage")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "homepage"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Homepage Hero Visual
          </button>
        </div>
      </div>

      {activeTab === "homepage" ? (
        <AdminHeroVisualSetting />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
        {/* Branding & Contacts */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
            Brand Identity &amp; Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store Display Name"
              required
              value={form.storeName}
              onChange={(e) => handleChange("storeName", e.target.value)}
            />
            <Input
              label="Tagline / Slogan"
              required
              value={form.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Support Email"
              type="email"
              required
              value={form.supportEmail}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
            />
            <Input
              label="Support Phone"
              required
              value={form.supportPhone}
              onChange={(e) => handleChange("supportPhone", e.target.value)}
            />
            <Input
              label="Official WhatsApp Number"
              required
              value={form.whatsappNumber}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              hint="Format: +8801700000000"
            />
          </div>
        </div>

        {/* Currency & Order Format */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
            Financial &amp; Order Numbering
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Currency Code"
              required
              value={form.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              placeholder="BDT"
            />
            <Input
              label="Currency Symbol"
              required
              value={form.currencySymbol}
              onChange={(e) => handleChange("currencySymbol", e.target.value)}
              placeholder="৳"
            />
            <Input
              label="Order Number Prefix"
              required
              value={form.orderPrefix}
              onChange={(e) => handleChange("orderPrefix", e.target.value)}
              placeholder="DV-"
            />
          </div>

          <Textarea
            label="Default Payment Instructions"
            rows={3}
            value={form.paymentInstructions}
            onChange={(e) => handleChange("paymentInstructions", e.target.value)}
          />
        </div>

        {/* SEO Configuration */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
            Global Search Engine Optimization (SEO)
          </h3>

          <Input
            label="Default SEO Title Tag"
            required
            value={form.seoTitle}
            onChange={(e) => handleChange("seoTitle", e.target.value)}
          />

          <Textarea
            label="Meta Description"
            required
            rows={3}
            value={form.seoDescription}
            onChange={(e) => handleChange("seoDescription", e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isSaving}
            leftIcon={<CheckCircle2 className="h-5 w-5" />}
          >
            Save All Settings
          </Button>
        </div>
      </form>
      )}
    </div>
  );
}
