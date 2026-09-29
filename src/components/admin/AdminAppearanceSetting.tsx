"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { SiteAppearanceSetting, DEFAULT_SITE_APPEARANCE } from "@/types/settings";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import {
  Palette,
  RotateCcw,
  Save,
  Check,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const PRESETS: { name: string; desc: string; colors: SiteAppearanceSetting }[] = [
  {
    name: "DigiVault Soft (Default)",
    desc: "Tactile soft surface with vibrant blue-purple primary accents",
    colors: {
      backgroundColor: "#F3F5F9",
      surfaceColor: "#FFFFFF",
      primaryColor: "#356DF3",
      secondaryColor: "#7548F5",
    },
  },
  {
    name: "Clean Slate",
    desc: "Crisp modern ecommerce slate with deep indigo accents",
    colors: {
      backgroundColor: "#F8FAFC",
      surfaceColor: "#FFFFFF",
      primaryColor: "#2563EB",
      secondaryColor: "#4F46E5",
    },
  },
  {
    name: "Soft Indigo Tint",
    desc: "Subtle cool indigo canvas with electric purple highlights",
    colors: {
      backgroundColor: "#EEF2FF",
      surfaceColor: "#FFFFFF",
      primaryColor: "#4338CA",
      secondaryColor: "#6366F1",
    },
  },
  {
    name: "Pure Minimalist",
    desc: "High key white background with subtle card elevations",
    colors: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      primaryColor: "#0F172A",
      secondaryColor: "#3B82F6",
    },
  },
];

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

export const AdminAppearanceSetting: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setPreviewAppearance, resetPreview, refetchAppearance } = useTheme();

  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ["admin-appearance-settings"],
    queryFn: () => settingsService.getAdminAppearanceSettings(),
  });

  const [form, setForm] = useState<SiteAppearanceSetting>(DEFAULT_SITE_APPEARANCE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialSettings) {
      setForm(initialSettings);
    }
  }, [initialSettings]);

  const updateMutation = useMutation({
    mutationFn: (data: SiteAppearanceSetting) =>
      settingsService.updateAppearanceSettings(data),
    onSuccess: async () => {
      toast.success("Site appearance & background updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-appearance-settings"] });
      await refetchAppearance();
    },
    onError: () => {
      toast.error("Failed to update site appearance settings.");
    },
  });

  const handleColorChange = (key: keyof SiteAppearanceSetting, hex: string) => {
    const sanitized = hex.startsWith("#") ? hex : `#${hex}`;
    setForm((prev) => {
      const next = { ...prev, [key]: sanitized };
      // Real-time preview if valid HEX
      if (HEX_REGEX.test(sanitized)) {
        setPreviewAppearance({ [key]: sanitized });
        setErrors((errs) => {
          const cp = { ...errs };
          delete cp[key];
          return cp;
        });
      } else {
        setErrors((errs) => ({ ...errs, [key]: "Must be a valid 6-char HEX (#RRGGBB)" }));
      }
      return next;
    });
  };

  const applyPreset = (preset: SiteAppearanceSetting) => {
    setForm(preset);
    setErrors({});
    setPreviewAppearance(preset);
    toast.info("Preset applied to preview. Click 'Save Appearance' to persist.");
  };

  const handleResetToDefault = () => {
    setForm(DEFAULT_SITE_APPEARANCE);
    setErrors({});
    setPreviewAppearance(DEFAULT_SITE_APPEARANCE);
    toast.info("Reset to default colors. Click 'Save Appearance' to apply.");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all colors
    const keys: (keyof SiteAppearanceSetting)[] = [
      "backgroundColor",
      "surfaceColor",
      "primaryColor",
      "secondaryColor",
    ];
    const newErrors: Record<string, string> = {};
    for (const k of keys) {
      const val = form[k];
      if (typeof val === "string" && !HEX_REGEX.test(val)) {
        newErrors[k] = "Must be a valid 6-character HEX color (e.g. #F3F5F9)";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the invalid HEX color values.");
      return;
    }

    updateMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-slate-500 font-medium">
        Loading site appearance settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Global Site Appearance &amp; Background
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control the background and surface theme of the ENTIRE marketplace. All customer and store routes dynamically inherit these settings without hardcoded colors.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToDefault}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>

      {/* Preset Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Curated Color Themes
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset.colors)}
              className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-primary-500/60 shadow-soft text-left transition-all hover:-translate-y-0.5 group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                <span
                  className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                  style={{ backgroundColor: preset.colors.backgroundColor }}
                  title="Background"
                />
                <span
                  className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                  style={{ backgroundColor: preset.colors.surfaceColor }}
                  title="Surface"
                />
                <span
                  className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                  style={{ backgroundColor: preset.colors.primaryColor }}
                  title="Primary"
                />
                <span
                  className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                  style={{ backgroundColor: preset.colors.secondaryColor }}
                  title="Secondary"
                />
              </div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-primary-600 transition-colors">
                {preset.name}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Controls (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-5">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Theme Color Tokens</span>
              <span className="text-[11px] font-medium text-slate-400">All fields accept 6-char HEX</span>
            </h3>

            {/* 1. Website Background Color (REQUIRED) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Website Background Color (Global)</span>
                <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                  Required
                </span>
              </label>
              <p className="text-[11px] text-slate-500">
                Applied to Home, Products, Cart, Checkout, Login, and all customer pages.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={HEX_REGEX.test(form.backgroundColor) ? form.backgroundColor : "#F3F5F9"}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="h-11 w-14 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={form.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  placeholder="#F3F5F9"
                  maxLength={7}
                  className="flex-1 font-mono uppercase text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>
              {errors.backgroundColor && (
                <p className="text-[11px] text-rose-600 font-semibold">{errors.backgroundColor}</p>
              )}
            </div>

            {/* 2. Surface / Card Color */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">
                Surface &amp; Card Background Color
              </label>
              <p className="text-[11px] text-slate-500">
                Applied to product cards, modal dialogs, and form containers for clean elevation.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={HEX_REGEX.test(form.surfaceColor) ? form.surfaceColor : "#FFFFFF"}
                  onChange={(e) => handleColorChange("surfaceColor", e.target.value)}
                  className="h-11 w-14 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={form.surfaceColor}
                  onChange={(e) => handleColorChange("surfaceColor", e.target.value)}
                  placeholder="#FFFFFF"
                  maxLength={7}
                  className="flex-1 font-mono uppercase text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>
              {errors.surfaceColor && (
                <p className="text-[11px] text-rose-600 font-semibold">{errors.surfaceColor}</p>
              )}
            </div>

            {/* 3. Primary Brand Color */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">
                Primary Brand Color
              </label>
              <p className="text-[11px] text-slate-500">
                Applied to primary action buttons, active navigation indicators, and key highlights.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={HEX_REGEX.test(form.primaryColor) ? form.primaryColor : "#356DF3"}
                  onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                  className="h-11 w-14 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                  placeholder="#356DF3"
                  maxLength={7}
                  className="flex-1 font-mono uppercase text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>
              {errors.primaryColor && (
                <p className="text-[11px] text-rose-600 font-semibold">{errors.primaryColor}</p>
              )}
            </div>

            {/* 4. Secondary Brand Color */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">
                Secondary Brand Color
              </label>
              <p className="text-[11px] text-slate-500">
                Used in multi-stop gradients, hover accents, and promotional elements.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={HEX_REGEX.test(form.secondaryColor) ? form.secondaryColor : "#7548F5"}
                  onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                  className="h-11 w-14 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={form.secondaryColor}
                  onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                  placeholder="#7548F5"
                  maxLength={7}
                  className="flex-1 font-mono uppercase text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>
              {errors.secondaryColor && (
                <p className="text-[11px] text-rose-600 font-semibold">{errors.secondaryColor}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={updateMutation.isPending}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Appearance
            </Button>
          </div>
        </form>

        {/* Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Eye className="h-4 w-4 text-primary-600" />
            <span>Real-time Live Preview</span>
          </div>

          <div
            className="rounded-3xl p-5 border border-slate-200/80 shadow-soft transition-all duration-300 space-y-4"
            style={{ backgroundColor: form.backgroundColor }}
          >
            {/* Miniature Navbar Preview */}
            <div
              className="rounded-2xl px-4 py-2.5 shadow-soft border border-slate-200/70 flex items-center justify-between"
              style={{ backgroundColor: form.surfaceColor }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-6 w-6 rounded-lg flex items-center justify-center text-white text-[11px] font-black"
                  style={{
                    background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                  }}
                >
                  DV
                </span>
                <span className="font-black text-xs text-slate-900">DigiVault</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span style={{ color: form.primaryColor }}>Store</span>
                <span>Account</span>
              </div>
            </div>

            {/* Miniature ProductCard Preview */}
            <div
              className="rounded-[18px] p-4 shadow-soft border border-slate-900/[0.08] space-y-3"
              style={{ backgroundColor: form.surfaceColor }}
            >
              {/* Image Frame */}
              <div
                className="aspect-[16/9] w-full rounded-[12px] flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: `${form.primaryColor}12`,
                  color: form.primaryColor,
                  border: `1px solid ${form.primaryColor}25`,
                }}
              >
                <span>Preview Visual</span>
              </div>

              <div className="space-y-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider block"
                  style={{ color: form.primaryColor }}
                >
                  AI &amp; Productivity
                </span>
                <div className="font-bold text-sm text-slate-900">
                  ChatGPT Plus Subscription
                </div>
                <div className="text-[11px] text-slate-500">
                  Available in 1 Month · 3 Months · 12 Months
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">From</span>
                  <span className="text-base font-extrabold text-slate-900">৳1,250</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">● Available</span>
              </div>

              {/* Action Button Preview */}
              <button
                type="button"
                className="w-full h-9 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft transition-all"
                style={{
                  background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                }}
              >
                <span>Explore Product</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-400 font-medium">
              Page canvas updates immediately as you edit colors.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
