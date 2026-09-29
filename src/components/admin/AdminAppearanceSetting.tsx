"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import {
  SiteAppearanceSetting,
  DEFAULT_SITE_APPEARANCE,
  FONT_OPTIONS,
  ProductCardHeightMode,
} from "@/types/settings";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getFontFamilyForId } from "@/lib/fonts";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import {
  Palette,
  Type,
  LayoutGrid,
  RotateCcw,
  Save,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PRESETS: { name: string; desc: string; colors: Partial<SiteAppearanceSetting> }[] = [
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

  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "cards">("colors");

  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ["admin-appearance-settings"],
    queryFn: () => settingsService.getAdminAppearanceSettings(),
  });

  const [form, setForm] = useState<SiteAppearanceSetting>(DEFAULT_SITE_APPEARANCE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialSettings) {
      setForm((prev) => ({ ...DEFAULT_SITE_APPEARANCE, ...initialSettings }));
    }
  }, [initialSettings]);

  const updateMutation = useMutation({
    mutationFn: (data: SiteAppearanceSetting) =>
      settingsService.updateAppearanceSettings(data),
    onSuccess: async () => {
      toast.success("Site appearance settings saved and applied globally!");
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

  const handleFontChange = (key: "uiFont" | "headingFont" | "bodyFont", fontId: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: fontId };
      setPreviewAppearance({ [key]: fontId });
      return next;
    });
  };

  const handleCardHeightModeChange = (mode: ProductCardHeightMode) => {
    setForm((prev) => {
      const next = { ...prev, productCardHeightMode: mode };
      setPreviewAppearance({ productCardHeightMode: mode });
      return next;
    });
  };

  const handleCardHeightChange = (height: number) => {
    const clamped = Math.max(320, Math.min(520, height));
    setForm((prev) => {
      const next = { ...prev, productCardHeight: clamped };
      setPreviewAppearance({ productCardHeight: clamped });
      return next;
    });
  };

  const applyPreset = (presetColors: Partial<SiteAppearanceSetting>) => {
    setForm((prev) => {
      const next = { ...prev, ...presetColors };
      setPreviewAppearance(next);
      return next;
    });
    setErrors({});
    toast.info("Theme preset loaded into live preview.");
  };

  const handleResetTypography = () => {
    const defaultTypography = {
      uiFont: "manrope",
      headingFont: "plus-jakarta-sans",
      bodyFont: "inter",
    };
    setForm((prev) => {
      const next = { ...prev, ...defaultTypography };
      setPreviewAppearance(next);
      return next;
    });
    toast.info("Typography reset to defaults (Manrope, Plus Jakarta Sans, Inter).");
  };

  const handleResetAllToDefault = () => {
    setForm(DEFAULT_SITE_APPEARANCE);
    setErrors({});
    setPreviewAppearance(DEFAULT_SITE_APPEARANCE);
    toast.info("Appearance reset to defaults. Click 'Save Appearance' to apply.");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const colorKeys: (keyof SiteAppearanceSetting)[] = [
      "backgroundColor",
      "surfaceColor",
      "primaryColor",
      "secondaryColor",
    ];
    const newErrors: Record<string, string> = {};
    for (const k of colorKeys) {
      const val = form[k];
      if (typeof val === "string" && !HEX_REGEX.test(val)) {
        newErrors[k] = "Must be a valid 6-character HEX color (e.g. #F3F5F9)";
      }
    }

    if (form.productCardHeightMode === "CUSTOM") {
      if (
        !form.productCardHeight ||
        form.productCardHeight < 320 ||
        form.productCardHeight > 520
      ) {
        newErrors.productCardHeight = "Custom height must be between 320px and 520px.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the validation errors before saving.");
      return;
    }

    updateMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-slate-500 font-medium">
        Loading appearance settings...
      </div>
    );
  }

  // Calculated preview card height
  const previewCardHeight =
    form.productCardHeightMode === "AUTO"
      ? "auto"
      : form.productCardHeightMode === "CUSTOM"
      ? `${form.productCardHeight || 390}px`
      : "390px";

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Site Appearance, Typography &amp; Product Cards
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure global background colors, brand palettes, typography library, and product card height.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetAllToDefault}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Defaults</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("colors")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
            activeTab === "colors"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <Palette className="h-4 w-4" />
          <span>Colors &amp; Background</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("typography")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
            activeTab === "typography"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <Type className="h-4 w-4" />
          <span>Global Typography</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cards")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
            activeTab === "cards"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Product Cards</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Form (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* TAB 1: Colors & Background */}
          {activeTab === "colors" && (
            <div className="space-y-6">
              {/* Preset Cards */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Curated Theme Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset.colors)}
                      className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-primary-500/60 shadow-soft text-left transition-all hover:-translate-y-0.5 group cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span
                          className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.backgroundColor }}
                        />
                        <span
                          className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.surfaceColor }}
                        />
                        <span
                          className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.primaryColor }}
                        />
                        <span
                          className="h-5 w-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.secondaryColor }}
                        />
                      </div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-primary-600">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Fields */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-5">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Custom Color Values</span>
                  <span className="text-[11px] font-medium text-slate-400">Accepts 6-char HEX</span>
                </h3>

                {/* Website Background */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Website Background Color</span>
                    <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      Global Canvas
                    </span>
                  </label>
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

                {/* Surface Color */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 block">
                    Surface &amp; Card Background Color
                  </label>
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

                {/* Primary Color */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 block">
                    Primary Brand Color
                  </label>
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

                {/* Secondary Color */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 block">
                    Secondary Brand Color
                  </label>
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
            </div>
          )}

          {/* TAB 2: Global Typography */}
          {activeTab === "typography" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Curated Font Library</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pre-compiled Google Fonts applied safely via static font classes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetTypography}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Fonts</span>
                  </button>
                </div>

                {/* 1. Main / UI Font */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>1. Main / UI Font</span>
                    <span className="text-[10px] text-slate-400">
                      Navbar, Buttons, Inputs, Dashboard
                    </span>
                  </label>
                  <select
                    value={form.uiFont || "manrope"}
                    onChange={(e) => handleFontChange("uiFont", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    {FONT_OPTIONS.filter((f) => !f.isHeadingOnly).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                  <div
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700"
                    style={{ fontFamily: getFontFamilyForId(form.uiFont || "manrope") }}
                  >
                    UI Preview: Navigation Button Input Filter Badge (Selected: {form.uiFont})
                  </div>
                </div>

                {/* 2. Heading / Title Font */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>2. Heading / Title Font</span>
                    <span className="text-[10px] text-slate-400">
                      H1, H2, H3, Section &amp; Product Titles
                    </span>
                  </label>
                  <select
                    value={form.headingFont || "plus-jakarta-sans"}
                    onChange={(e) => handleFontChange("headingFont", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} {f.isHeadingOnly ? "· [Display / Heading Only]" : `(${f.category})`}
                      </option>
                    ))}
                  </select>
                  <div
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-base sm:text-lg font-bold text-slate-900"
                    style={{
                      fontFamily: getFontFamilyForId(form.headingFont || "plus-jakarta-sans"),
                    }}
                  >
                    Premium Digital Tools &amp; Software Licenses
                  </div>
                </div>

                {/* 3. Paragraph / Body Font */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>3. Paragraph / Body Font</span>
                    <span className="text-[10px] text-slate-400">
                      Descriptions, FAQs, Guides, Copy
                    </span>
                  </label>
                  <select
                    value={form.bodyFont || "inter"}
                    onChange={(e) => handleFontChange("bodyFont", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    {FONT_OPTIONS.filter((f) => !f.isHeadingOnly).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                  <div
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-600 leading-relaxed"
                    style={{ fontFamily: getFontFamilyForId(form.bodyFont || "inter") }}
                  >
                    Browse genuine subscriptions with instant delivery and automated order activation.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Product Cards */}
          {activeTab === "cards" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-6">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Product Card Height Mode</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Control the visual height of storefront product cards. Mobile screens automatically stay content-safe.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-3">
                  {(["COMPACT", "AUTO", "CUSTOM"] as ProductCardHeightMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleCardHeightModeChange(mode)}
                      className={cn(
                        "p-3.5 rounded-xl border text-center transition-all cursor-pointer",
                        form.productCardHeightMode === mode
                          ? "border-primary-500 bg-primary-50/50 text-primary-700 shadow-soft"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      )}
                    >
                      <div className="text-xs font-bold uppercase">{mode}</div>
                      <div className="text-[10.5px] text-slate-500 mt-0.5">
                        {mode === "COMPACT"
                          ? "~390px default"
                          : mode === "AUTO"
                          ? "Natural content"
                          : "Adjustable height"}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Height Slider */}
                {form.productCardHeightMode === "CUSTOM" && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="h-3.5 w-3.5 text-primary-600" />
                        <span>Desktop Card Height</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-primary-600 font-extrabold text-xs shadow-xs">
                        {form.productCardHeight || 390}px
                      </span>
                    </div>

                    <input
                      type="range"
                      min={320}
                      max={520}
                      step={5}
                      value={form.productCardHeight || 390}
                      onChange={(e) => handleCardHeightChange(parseInt(e.target.value, 10))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>320px (Super Compact)</span>
                      <span>390px (Recommended)</span>
                      <span>520px (Spacious)</span>
                    </div>

                    {errors.productCardHeight && (
                      <p className="text-[11px] text-rose-600 font-semibold">
                        {errors.productCardHeight}
                      </p>
                    )}
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11.5px] text-blue-800 leading-relaxed">
                  <strong>Content-Safe Rule:</strong> Custom height setting is applied to desktop and tablet displays (min-width: 768px). On narrow mobile screens, card height automatically adapts to prevent text overflow.
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={updateMutation.isPending}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Appearance Settings
            </Button>
          </div>
        </form>

        {/* Real-time Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-24">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-primary-600" />
              <span>Real-time Live Preview</span>
            </div>
            <span className="text-[10px] font-normal text-slate-400">Updates live</span>
          </div>

          <div
            className="rounded-3xl p-5 border border-slate-200/80 shadow-soft transition-all duration-300 space-y-4"
            style={{ backgroundColor: form.backgroundColor }}
          >
            {/* Miniature Navbar Preview */}
            <div
              className="rounded-2xl px-4 py-2.5 shadow-soft border border-slate-200/70 flex items-center justify-between"
              style={{
                backgroundColor: form.surfaceColor,
                fontFamily: getFontFamilyForId(form.uiFont || "manrope"),
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-6 w-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                  style={{
                    background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                  }}
                >
                  DV
                </span>
                <span className="font-bold text-xs text-slate-900">DigiVault</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span style={{ color: form.primaryColor }}>Products</span>
                <span className="text-slate-500">Categories</span>
                <span className="text-slate-500">Support</span>
              </div>
            </div>

            {/* Redesigned Miniature ProductCard Preview */}
            <div
              className="rounded-[20px] p-3.5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-[rgba(15,23,42,0.07)] flex flex-col justify-between transition-all duration-200 overflow-hidden"
              style={{
                backgroundColor: form.surfaceColor,
                minHeight: previewCardHeight === "auto" ? "auto" : previewCardHeight,
              }}
            >
              {/* Framed Image (4/3 ratio, rounded 16px) */}
              <div
                className="relative aspect-[4/3] w-full rounded-[16px] flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-200/50"
                style={{
                  backgroundColor: `${form.primaryColor}14`,
                  color: form.primaryColor,
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-[11px]">Product Image</span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 shadow-xs border border-slate-200/80">
                    Featured
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col justify-between pt-3 pb-1">
                <div>
                  <div
                    className="text-[16px] font-bold text-slate-900 leading-[1.25] line-clamp-2"
                    style={{
                      fontFamily: getFontFamilyForId(
                        form.headingFont || "plus-jakarta-sans"
                      ),
                    }}
                  >
                    ChatGPT Plus Subscription
                  </div>
                  <p
                    className="text-[12.5px] text-[#667085] line-clamp-2 leading-[1.4] mt-1"
                    style={{ fontFamily: getFontFamilyForId(form.bodyFont || "inter") }}
                  >
                    Official account access with GPT-4, DALL-E, and Advanced Voice Mode.
                  </p>
                </div>

                {/* Price & Full-Width CTA */}
                <div className="pt-2.5 mt-auto space-y-2">
                  <div className="text-[20px] font-extrabold text-slate-900 tracking-tight leading-none">
                    ৳1,250
                  </div>

                  <button
                    type="button"
                    className="w-full h-[40px] rounded-[11px] text-white text-xs font-bold flex items-center justify-center shadow-xs select-none"
                    style={{
                      background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                      fontFamily: getFontFamilyForId(form.uiFont || "manrope"),
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center text-[10.5px] text-slate-400 font-medium">
              Height Mode: {form.productCardHeightMode} ({previewCardHeight})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
