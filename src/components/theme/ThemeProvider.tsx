"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SiteAppearanceSetting, DEFAULT_SITE_APPEARANCE } from "@/types/settings";
import { settingsService } from "@/services/settingsService";
import { getFontFamilyForId } from "@/lib/fonts";

interface ThemeContextType {
  appearance: SiteAppearanceSetting;
  setPreviewAppearance: (appearance: Partial<SiteAppearanceSetting>) => void;
  resetPreview: () => void;
  refetchAppearance: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  appearance: DEFAULT_SITE_APPEARANCE,
  setPreviewAppearance: () => {},
  resetPreview: () => {},
  refetchAppearance: async () => {},
});

export const useTheme = () => useContext(ThemeContext);

const APPEARANCE_STORAGE_KEY = "dg_appearance_settings";

export function applyThemeVariables(settings: SiteAppearanceSetting) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Global Canvas & Brand
  if (settings.backgroundColor) {
    root.style.setProperty("--site-bg", settings.backgroundColor);
    document.body.style.backgroundColor = settings.backgroundColor;
  }
  if (settings.surfaceColor) {
    root.style.setProperty("--site-surface", settings.surfaceColor);
  }
  if (settings.primaryColor) {
    root.style.setProperty("--site-primary", settings.primaryColor);
  }
  if (settings.secondaryColor) {
    root.style.setProperty("--site-secondary", settings.secondaryColor);
  }

  // Navbar
  if (settings.navbarBgColor) {
    root.style.setProperty("--site-navbar-bg", settings.navbarBgColor);
  }
  if (settings.navbarTextColor) {
    root.style.setProperty("--site-navbar-text", settings.navbarTextColor);
  }
  if (settings.navbarBorderColor) {
    root.style.setProperty("--site-navbar-border", settings.navbarBorderColor);
  }

  // Product & Showcase Cards
  if (settings.cardBgColor) {
    root.style.setProperty("--site-card-bg", settings.cardBgColor);
  }
  if (settings.cardBorderColor) {
    root.style.setProperty("--site-card-border", settings.cardBorderColor);
  }
  if (settings.cardHoverBorderColor) {
    root.style.setProperty("--site-card-hover-border", settings.cardHoverBorderColor);
  }

  // Typography Colors
  if (settings.textMainColor) {
    root.style.setProperty("--site-text-main", settings.textMainColor);
    root.style.setProperty("--text-main", settings.textMainColor);
  }
  if (settings.textSecondaryColor) {
    root.style.setProperty("--site-text-secondary", settings.textSecondaryColor);
    root.style.setProperty("--text-secondary", settings.textSecondaryColor);
  }
  if (settings.textMutedColor) {
    root.style.setProperty("--site-text-muted", settings.textMutedColor);
    root.style.setProperty("--text-muted", settings.textMutedColor);
  }

  // Global Base Font Size
  if (settings.baseFontSize) {
    root.style.setProperty("--site-base-font-size", `${settings.baseFontSize}px`);
    root.style.fontSize = `${settings.baseFontSize}px`;
  }

  // Product Details Page
  if (settings.detailsBgColor) {
    root.style.setProperty("--site-details-bg", settings.detailsBgColor);
  }
  if (settings.detailsBayBgColor) {
    root.style.setProperty("--site-details-bay-bg", settings.detailsBayBgColor);
  }
  if (settings.detailsBorderColor) {
    root.style.setProperty("--site-details-border", settings.detailsBorderColor);
  }
  if (settings.detailsAccentColor) {
    root.style.setProperty("--site-details-accent", settings.detailsAccentColor);
  }
  if (settings.detailsPriceColor) {
    root.style.setProperty("--site-details-price", settings.detailsPriceColor);
  }
  if (settings.detailsBtnBgColor) {
    root.style.setProperty("--site-details-btn-bg", settings.detailsBtnBgColor);
  }
  if (settings.detailsBtnTextColor) {
    root.style.setProperty("--site-details-btn-text", settings.detailsBtnTextColor);
  }

  // Typography Font Families
  const uiFont = getFontFamilyForId(settings.uiFont || "plus-jakarta-sans");
  const headingFont = getFontFamilyForId(settings.headingFont || "plus-jakarta-sans");
  const bodyFont = getFontFamilyForId(settings.bodyFont || "plus-jakarta-sans");

  root.style.setProperty("--font-ui", uiFont);
  root.style.setProperty("--font-heading", headingFont);
  root.style.setProperty("--font-body", bodyFont);

  // Card Height
  if (settings.productCardHeightMode === "AUTO") {
    root.style.setProperty("--product-card-height", "auto");
  } else if (settings.productCardHeightMode === "CUSTOM" && settings.productCardHeight) {
    root.style.setProperty("--product-card-height", `${settings.productCardHeight}px`);
  } else {
    // COMPACT default: 400px
    root.style.setProperty("--product-card-height", "400px");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<SiteAppearanceSetting>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(APPEARANCE_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.backgroundColor) return { ...DEFAULT_SITE_APPEARANCE, ...parsed };
        }
      } catch {}
    }
    return DEFAULT_SITE_APPEARANCE;
  });

  const [activeTheme, setActiveTheme] = useState<SiteAppearanceSetting>(appearance);

  const fetchAppearance = useCallback(async () => {
    try {
      const data = await settingsService.getAppearanceSettings();
      if (data && data.backgroundColor) {
        const merged = { ...DEFAULT_SITE_APPEARANCE, ...data };
        setAppearance(merged);
        setActiveTheme(merged);
        applyThemeVariables(merged);
      }
    } catch {
      // Fallback already active
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAppearance();
  }, [fetchAppearance]);

  // Update DOM when activeTheme changes
  useEffect(() => {
    applyThemeVariables(activeTheme);
  }, [activeTheme]);

  const setPreviewAppearance = (partial: Partial<SiteAppearanceSetting>) => {
    setActiveTheme((prev) => {
      const next = { ...prev, ...partial };
      applyThemeVariables(next);
      return next;
    });
  };

  const resetPreview = () => {
    setActiveTheme(appearance);
    applyThemeVariables(appearance);
  };

  return (
    <ThemeContext.Provider
      value={{
        appearance: activeTheme,
        setPreviewAppearance,
        resetPreview,
        refetchAppearance: fetchAppearance,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
