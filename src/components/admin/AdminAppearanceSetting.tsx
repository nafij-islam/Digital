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
  Compass,
  FileText,
  Check,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PRESETS: { name: string; desc: string; colors: Partial<SiteAppearanceSetting> }[] = [
  {
    name: "Deep Obsidian Dark (Default)",
    desc: "Tactile stealth obsidian surface with electric indigo accents",
    colors: {
      backgroundColor: "#0B0F19",
      surfaceColor: "#141A2E",
      primaryColor: "#6366F1",
      secondaryColor: "#818CF8",
      navbarBgColor: "#0B0F19",
      navbarTextColor: "#CBD5E1",
      navbarBorderColor: "#1E2642",
      cardBgColor: "#141A2E",
      cardBorderColor: "#1E2642",
      cardHoverBorderColor: "#6366F1",
      textMainColor: "#F8FAFC",
      textSecondaryColor: "#CBD5E1",
      textMutedColor: "#94A3B8",
      baseFontSize: 16,
      detailsBgColor: "#141A2E",
      detailsBayBgColor: "#0F1424",
      detailsBorderColor: "#1E2642",
      detailsAccentColor: "#6366F1",
      detailsPriceColor: "#F8FAFC",
      detailsBtnBgColor: "#6366F1",
      detailsBtnTextColor: "#FFFFFF",
    },
  },
  {
    name: "Cyberpunk Midnight Blue",
    desc: "Deep space navy with high-luminance neon cyan & sapphire accents",
    colors: {
      backgroundColor: "#030712",
      surfaceColor: "#0F172A",
      primaryColor: "#2563EB",
      secondaryColor: "#38BDF8",
      navbarBgColor: "#030712",
      navbarTextColor: "#94A3B8",
      navbarBorderColor: "#1E293B",
      cardBgColor: "#0F172A",
      cardBorderColor: "#1E293B",
      cardHoverBorderColor: "#38BDF8",
      textMainColor: "#F8FAFC",
      textSecondaryColor: "#94A3B8",
      textMutedColor: "#64748B",
      baseFontSize: 16,
      detailsBgColor: "#0F172A",
      detailsBayBgColor: "#020617",
      detailsBorderColor: "#1E293B",
      detailsAccentColor: "#38BDF8",
      detailsPriceColor: "#38BDF8",
      detailsBtnBgColor: "#2563EB",
      detailsBtnTextColor: "#FFFFFF",
    },
  },
  {
    name: "Emerald Cyber Matrix",
    desc: "Matrix carbon emerald canvas with radiant mint glow",
    colors: {
      backgroundColor: "#051510",
      surfaceColor: "#0C251C",
      primaryColor: "#10B981",
      secondaryColor: "#34D399",
      navbarBgColor: "#051510",
      navbarTextColor: "#A7F3D0",
      navbarBorderColor: "#143E30",
      cardBgColor: "#0C251C",
      cardBorderColor: "#143E30",
      cardHoverBorderColor: "#10B981",
      textMainColor: "#F0FDF4",
      textSecondaryColor: "#A7F3D0",
      textMutedColor: "#6EE7B7",
      baseFontSize: 16,
      detailsBgColor: "#0C251C",
      detailsBayBgColor: "#04100C",
      detailsBorderColor: "#143E30",
      detailsAccentColor: "#10B981",
      detailsPriceColor: "#34D399",
      detailsBtnBgColor: "#10B981",
      detailsBtnTextColor: "#FFFFFF",
    },
  },
  {
    name: "Ruby Charcoal Luxury",
    desc: "Luxury volcanic charcoal canvas with vivid crimson rubies",
    colors: {
      backgroundColor: "#0E0E11",
      surfaceColor: "#18181F",
      primaryColor: "#E11D48",
      secondaryColor: "#FB7185",
      navbarBgColor: "#0E0E11",
      navbarTextColor: "#FECDD3",
      navbarBorderColor: "#272733",
      cardBgColor: "#18181F",
      cardBorderColor: "#272733",
      cardHoverBorderColor: "#E11D48",
      textMainColor: "#FFF1F2",
      textSecondaryColor: "#FECDD3",
      textMutedColor: "#FDA4AF",
      baseFontSize: 16,
      detailsBgColor: "#18181F",
      detailsBayBgColor: "#08080A",
      detailsBorderColor: "#272733",
      detailsAccentColor: "#E11D48",
      detailsPriceColor: "#FFF1F2",
      detailsBtnBgColor: "#E11D48",
      detailsBtnTextColor: "#FFFFFF",
    },
  },
  {
    name: "Crisp Clean Modern Light",
    desc: "Pristine white cards on slate background with deep cobalt accents",
    colors: {
      backgroundColor: "#F8FAFC",
      surfaceColor: "#FFFFFF",
      primaryColor: "#2563EB",
      secondaryColor: "#4F46E5",
      navbarBgColor: "#FFFFFF",
      navbarTextColor: "#334155",
      navbarBorderColor: "#E2E8F0",
      cardBgColor: "#FFFFFF",
      cardBorderColor: "#E2E8F0",
      cardHoverBorderColor: "#2563EB",
      textMainColor: "#0F172A",
      textSecondaryColor: "#475569",
      textMutedColor: "#94A3B8",
      baseFontSize: 16,
      detailsBgColor: "#FFFFFF",
      detailsBayBgColor: "#F1F5F9",
      detailsBorderColor: "#E2E8F0",
      detailsAccentColor: "#2563EB",
      detailsPriceColor: "#0F172A",
      detailsBtnBgColor: "#2563EB",
      detailsBtnTextColor: "#FFFFFF",
    },
  },
  {
    name: "Soft Lavender Minimal",
    desc: "Delicate soft lilac tinted canvas with violet royal accents",
    colors: {
      backgroundColor: "#F5F3FF",
      surfaceColor: "#FFFFFF",
      primaryColor: "#7C3AED",
      secondaryColor: "#A78BFA",
      navbarBgColor: "#FFFFFF",
      navbarTextColor: "#4C1D95",
      navbarBorderColor: "#EDE9FE",
      cardBgColor: "#FFFFFF",
      cardBorderColor: "#EDE9FE",
      cardHoverBorderColor: "#7C3AED",
      textMainColor: "#2E1065",
      textSecondaryColor: "#5B21B6",
      textMutedColor: "#8B5CF6",
      baseFontSize: 16,
      detailsBgColor: "#FFFFFF",
      detailsBayBgColor: "#FAF5FF",
      detailsBorderColor: "#EDE9FE",
      detailsAccentColor: "#7C3AED",
      detailsPriceColor: "#2E1065",
      detailsBtnBgColor: "#7C3AED",
      detailsBtnTextColor: "#FFFFFF",
    },
  },
];

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

export const AdminAppearanceSetting: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setPreviewAppearance, refetchAppearance } = useTheme();

  const [activeTab, setActiveTab] = useState<
    "colors" | "navbar" | "cards" | "details" | "typography"
  >("colors");

  const [previewMode, setPreviewMode] = useState<"card" | "navbar" | "details">("card");

  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ["admin-appearance-settings"],
    queryFn: () => settingsService.getAdminAppearanceSettings(),
  });

  const [form, setForm] = useState<SiteAppearanceSetting>(DEFAULT_SITE_APPEARANCE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialSettings) {
      setForm((prev) => ({ ...DEFAULT_SITE_APPEARANCE, ...prev, ...initialSettings }));
    }
  }, [initialSettings]);

  const updateMutation = useMutation({
    mutationFn: (data: SiteAppearanceSetting) =>
      settingsService.updateAppearanceSettings(data),
    onSuccess: async () => {
      toast.success("Site appearance, colors, and typography saved and applied globally!");
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

  const handleFontSizeChange = (size: number) => {
    const clamped = Math.max(13, Math.min(22, size));
    setForm((prev) => {
      const next = { ...prev, baseFontSize: clamped };
      setPreviewAppearance({ baseFontSize: clamped });
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
    toast.info("Theme preset applied to live preview.");
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
      "navbarBgColor",
      "navbarTextColor",
      "navbarBorderColor",
      "cardBgColor",
      "cardBorderColor",
      "cardHoverBorderColor",
      "textMainColor",
      "textSecondaryColor",
      "textMutedColor",
      "detailsBgColor",
      "detailsBayBgColor",
      "detailsBorderColor",
      "detailsAccentColor",
      "detailsPriceColor",
      "detailsBtnBgColor",
      "detailsBtnTextColor",
    ];

    const newErrors: Record<string, string> = {};
    for (const k of colorKeys) {
      const val = form[k];
      if (typeof val === "string" && val && !HEX_REGEX.test(val)) {
        newErrors[k] = "Must be a valid 6-character HEX color (e.g. #0B0F19)";
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

  // Reusable Color Input Row Component
  const renderColorInput = (
    key: keyof SiteAppearanceSetting,
    label: string,
    badgeText?: string,
    fallbackHex = "#141A2E"
  ) => {
    const val = (form[key] as string) || fallbackHex;
    const isValidHex = HEX_REGEX.test(val);

    return (
      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>{label}</span>
          {badgeText && (
            <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {badgeText}
            </span>
          )}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={isValidHex ? val : fallbackHex}
            onChange={(e) => handleColorChange(key, e.target.value)}
            className="h-11 w-14 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shrink-0"
          />
          <input
            type="text"
            value={val}
            onChange={(e) => handleColorChange(key, e.target.value)}
            placeholder={fallbackHex}
            maxLength={7}
            className="flex-1 font-mono uppercase text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </div>
        {errors[key] && (
          <p className="text-[11px] text-rose-600 font-semibold">{errors[key]}</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-slate-500 font-medium">
        Loading appearance settings...
      </div>
    );
  }

  const previewCardHeight =
    form.productCardHeightMode === "AUTO"
      ? "auto"
      : form.productCardHeightMode === "CUSTOM"
      ? `${form.productCardHeight || 400}px`
      : "400px";

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Site Appearance, Colors &amp; Typography Control
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete design freedom: customize Navbar, Cards, Product Details, Typography sizes &amp; colors with zero runtime latency.
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
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("colors")}
          className={cn(
            "flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
            activeTab === "colors"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <Palette className="h-4 w-4" />
          <span>Global Brand</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("navbar")}
          className={cn(
            "flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
            activeTab === "navbar"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <Compass className="h-4 w-4" />
          <span>Navbar &amp; Header</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cards")}
          className={cn(
            "flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
            activeTab === "cards"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Product Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={cn(
            "flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
            activeTab === "details"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Product Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("typography")}
          className={cn(
            "flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
            activeTab === "typography"
              ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          )}
        >
          <Type className="h-4 w-4" />
          <span>Typography &amp; Sizes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Form (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* TAB 1: Global Brand & Colors */}
          {activeTab === "colors" && (
            <div className="space-y-6">
              {/* Preset Cards */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Curated 1-Click Theme Presets
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
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-4">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Global Brand Palettes</span>
                  <span className="text-[11px] font-medium text-slate-400">Accepts 6-char HEX</span>
                </h3>

                {renderColorInput("backgroundColor", "Website Canvas Background", "Global Canvas", "#0B0F19")}
                {renderColorInput("surfaceColor", "Surface & Containers Background", "Global Surface", "#141A2E")}
                {renderColorInput("primaryColor", "Primary Brand & CTA Accent", "Brand Accent", "#6366F1")}
                {renderColorInput("secondaryColor", "Secondary Accent & Highlights", "Bright Glow", "#818CF8")}
              </div>
            </div>
          )}

          {/* TAB 2: Navbar & Header */}
          {activeTab === "navbar" && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Navbar &amp; Header Customization</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Control the sticky top bar background, navigation link colors, and subtle border lines.
                </p>
              </div>

              {renderColorInput("navbarBgColor", "Navbar Background Color", "Header Fill", "#0B0F19")}
              {renderColorInput("navbarTextColor", "Navbar Links & Icons Color", "Menu Links", "#CBD5E1")}
              {renderColorInput("navbarBorderColor", "Navbar Border & Divider Color", "Outline", "#1E2642")}
            </div>
          )}

          {/* TAB 3: Product Cards */}
          {activeTab === "cards" && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Product Cards Styling &amp; Height</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Adjust card backgrounds, borders, hover accent glows, and desktop height modes.
                </p>
              </div>

              {renderColorInput("cardBgColor", "Card Background Color", "Card Fill", "#141A2E")}
              {renderColorInput("cardBorderColor", "Card Border Color", "Card Outline", "#1E2642")}
              {renderColorInput("cardHoverBorderColor", "Card Hover Border Glow", "Glow Accent", "#6366F1")}

              {/* Mode Selector */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Product Card Height Mode
                </label>
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
                          ? "~400px default"
                          : mode === "AUTO"
                          ? "Natural content"
                          : "Adjustable height"}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Height Slider */}
                {form.productCardHeightMode === "CUSTOM" && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="h-3.5 w-3.5 text-primary-600" />
                        <span>Desktop Card Height</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-primary-600 font-extrabold text-xs shadow-xs">
                        {form.productCardHeight || 400}px
                      </span>
                    </div>

                    <input
                      type="range"
                      min={320}
                      max={520}
                      step={5}
                      value={form.productCardHeight || 400}
                      onChange={(e) => handleCardHeightChange(parseInt(e.target.value, 10))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>320px (Compact)</span>
                      <span>400px (Recommended)</span>
                      <span>520px (Spacious)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Product Details Page */}
          {activeTab === "details" && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Product Details Page Design</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Control product chassis background, specifications bay, pricing, and action buy button colors.
                </p>
              </div>

              {renderColorInput("detailsBgColor", "Details Chassis & Main Box Background", "Chassis", "#141A2E")}
              {renderColorInput("detailsBayBgColor", "Media Screen & Specs Bay Background", "Inner Bay", "#0F1424")}
              {renderColorInput("detailsBorderColor", "Details Border & Divider Color", "Outline", "#1E2642")}
              {renderColorInput("detailsAccentColor", "Highlight & Badge Accent Color", "Accent", "#6366F1")}
              {renderColorInput("detailsPriceColor", "Price Number Display Color", "Price", "#F8FAFC")}
              {renderColorInput("detailsBtnBgColor", "Buy Button Background Color", "Buy Button", "#6366F1")}
              {renderColorInput("detailsBtnTextColor", "Buy Button Text Color", "Button Text", "#FFFFFF")}
            </div>
          )}

          {/* TAB 5: Typography & Font Sizes */}
          {activeTab === "typography" && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-soft space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Global Typography &amp; Font Sizes</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scale font sizes proportionally across the entire website and customize text colors.
                  </p>
                </div>
              </div>

              {/* Font Size Scaling Slider */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Type className="h-4 w-4 text-primary-600" />
                    <span>Global Base Font Size (Scales All Elements)</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-primary-600 font-extrabold text-xs shadow-xs">
                    {form.baseFontSize || 16}px
                  </span>
                </div>

                <input
                  type="range"
                  min={14}
                  max={20}
                  step={1}
                  value={form.baseFontSize || 16}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
                  className="w-full accent-primary-600 cursor-pointer"
                />

                {/* Quick Font Size Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: "14px (Compact)", val: 14 },
                    { label: "15px (Neat)", val: 15 },
                    { label: "16px (Standard)", val: 16 },
                    { label: "17px (Comfort)", val: 17 },
                    { label: "18px (Large)", val: 18 },
                    { label: "20px (XL)", val: 20 },
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => handleFontSizeChange(chip.val)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                        form.baseFontSize === chip.val
                          ? "bg-primary-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Colors */}
              {renderColorInput("textMainColor", "Primary Text Color (Headings & Titles)", "Main Text", "#F8FAFC")}
              {renderColorInput("textSecondaryColor", "Secondary Text Color (Descriptions)", "Subtext", "#CBD5E1")}
              {renderColorInput("textMutedColor", "Muted Subtext & Metadata Color", "Muted", "#94A3B8")}

              {/* Font Families */}
              <div className="space-y-4 pt-3 border-t border-slate-100">
                {/* 1. Main / UI Font */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>1. Main / UI Font Family</span>
                    <span className="text-[10px] text-slate-400">Buttons, Nav, Inputs</span>
                  </label>
                  <select
                    value={form.uiFont || "plus-jakarta-sans"}
                    onChange={(e) => handleFontChange("uiFont", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    {FONT_OPTIONS.filter((f) => !f.isHeadingOnly).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Heading Font */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>2. Heading / Title Font Family</span>
                    <span className="text-[10px] text-slate-400">H1, H2, Product Names</span>
                  </label>
                  <select
                    value={form.headingFont || "plus-jakarta-sans"}
                    onChange={(e) => handleFontChange("headingFont", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} {f.isHeadingOnly ? "· [Heading Only]" : `(${f.category})`}
                      </option>
                    ))}
                  </select>
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
            <div className="flex items-center gap-1 text-[11px] bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewMode("card")}
                className={cn(
                  "px-2 py-0.5 rounded font-bold transition-all cursor-pointer",
                  previewMode === "card" ? "bg-white text-primary-600 shadow-2xs" : "text-slate-500"
                )}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("navbar")}
                className={cn(
                  "px-2 py-0.5 rounded font-bold transition-all cursor-pointer",
                  previewMode === "navbar" ? "bg-white text-primary-600 shadow-2xs" : "text-slate-500"
                )}
              >
                Nav
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("details")}
                className={cn(
                  "px-2 py-0.5 rounded font-bold transition-all cursor-pointer",
                  previewMode === "details" ? "bg-white text-primary-600 shadow-2xs" : "text-slate-500"
                )}
              >
                Details
              </button>
            </div>
          </div>

          <div
            className="rounded-3xl p-5 border shadow-soft transition-all duration-300 space-y-4"
            style={{
              backgroundColor: form.backgroundColor,
              borderColor: form.cardBorderColor || "#1E2642",
              fontSize: `${form.baseFontSize || 16}px`,
            }}
          >
            {/* 1. Miniature Navbar Preview */}
            <div
              className="rounded-2xl px-4 py-2.5 shadow-soft border flex items-center justify-between"
              style={{
                backgroundColor: form.navbarBgColor || form.surfaceColor,
                borderColor: form.navbarBorderColor || "#1E2642",
                fontFamily: getFontFamilyForId(form.uiFont || "plus-jakarta-sans"),
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-6 w-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                  style={{
                    background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                  }}
                >
                  SN
                </span>
                <span
                  className="font-bold text-xs"
                  style={{ color: form.textMainColor || "#F8FAFC" }}
                >
                  shop.nafij
                </span>
              </div>
              <div
                className="flex items-center gap-3 text-[11px] font-bold"
                style={{ color: form.navbarTextColor || "#CBD5E1" }}
              >
                <span style={{ color: form.primaryColor }}>Products</span>
                <span>Deals</span>
                <span>Support</span>
              </div>
            </div>

            {/* 2. Miniature Product Card Preview */}
            {previewMode !== "details" && (
              <div
                className="rounded-[22px] p-3.5 shadow-raised border flex flex-col justify-between transition-all duration-200 overflow-hidden"
                style={{
                  backgroundColor: form.cardBgColor || form.surfaceColor,
                  borderColor: form.cardBorderColor || "#1E2642",
                  minHeight: previewCardHeight === "auto" ? "auto" : previewCardHeight,
                }}
              >
                {/* Framed Image */}
                <div
                  className="relative aspect-[4/3] w-full rounded-[16px] flex items-center justify-center font-bold text-xs overflow-hidden border"
                  style={{
                    backgroundColor: form.detailsBayBgColor || "#0F1424",
                    borderColor: form.cardBorderColor || "#1E2642",
                    color: form.secondaryColor,
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-[11px]">Canva Pro Access</span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border shadow-xs"
                      style={{
                        backgroundColor: form.detailsBayBgColor || "#0F1424",
                        color: form.secondaryColor,
                        borderColor: form.primaryColor,
                      }}
                    >
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-between pt-3 pb-1">
                  <div>
                    <div
                      className="text-[16px] font-extrabold leading-[1.25] line-clamp-2"
                      style={{
                        color: form.textMainColor || "#F8FAFC",
                        fontFamily: getFontFamilyForId(
                          form.headingFont || "plus-jakarta-sans"
                        ),
                      }}
                    >
                      Canva Pro Private Subscription
                    </div>
                    <p
                      className="text-[12.5px] line-clamp-2 leading-[1.4] mt-1"
                      style={{
                        color: form.textSecondaryColor || "#CBD5E1",
                        fontFamily: getFontFamilyForId(form.bodyFont || "plus-jakarta-sans"),
                      }}
                    >
                      Official EDU/Pro membership with brand kits, background remover &amp; AI tools.
                    </p>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-2.5 mt-auto space-y-2">
                    <div
                      className="text-[20px] font-black font-mono tracking-tight leading-none"
                      style={{ color: form.textMainColor || "#F8FAFC" }}
                    >
                      ৳450
                    </div>

                    <button
                      type="button"
                      className="w-full h-[40px] rounded-full text-white text-xs font-extrabold flex items-center justify-center shadow-raised select-none uppercase tracking-wider"
                      style={{
                        background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                        fontFamily: getFontFamilyForId(form.uiFont || "plus-jakarta-sans"),
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Miniature Details Page Snippet Preview */}
            {previewMode === "details" && (
              <div
                className="rounded-2xl p-4 border space-y-3 shadow-raised"
                style={{
                  backgroundColor: form.detailsBgColor || form.surfaceColor,
                  borderColor: form.detailsBorderColor || "#1E2642",
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span style={{ color: form.textMutedColor || "#94A3B8" }}>PROTOCOL {"//"} 01</span>
                  <span
                    className="px-2 py-0.5 rounded-full font-bold text-[9px] border"
                    style={{
                      backgroundColor: form.detailsBayBgColor || "#0F1424",
                      color: "#10B981",
                      borderColor: "rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    INSTANT DELIVERY
                  </span>
                </div>

                <div
                  className="p-3 rounded-xl border space-y-1"
                  style={{
                    backgroundColor: form.detailsBayBgColor || "#0F1424",
                    borderColor: form.detailsBorderColor || "#1E2642",
                  }}
                >
                  <div
                    className="text-[9px] font-mono font-bold"
                    style={{ color: form.textMutedColor || "#94A3B8" }}
                  >
                    TOTAL PAYABLE
                  </div>
                  <div
                    className="text-2xl font-black font-mono"
                    style={{ color: form.detailsPriceColor || "#F8FAFC" }}
                  >
                    ৳1,250
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full h-10 rounded-full font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-raised"
                  style={{
                    backgroundColor: form.detailsBtnBgColor || form.primaryColor,
                    color: form.detailsBtnTextColor || "#FFFFFF",
                  }}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Buy Now (Instant Checkout)</span>
                </button>
              </div>
            )}

            <div
              className="text-center text-[10.5px] font-medium"
              style={{ color: form.textMutedColor || "#94A3B8" }}
            >
              Base Font Size: {form.baseFontSize || 16}px · Card Height: {form.productCardHeightMode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
