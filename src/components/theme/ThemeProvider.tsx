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

  // Colors
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

  // Typography
  const uiFont = getFontFamilyForId(settings.uiFont || "manrope");
  const headingFont = getFontFamilyForId(settings.headingFont || "plus-jakarta-sans");
  const bodyFont = getFontFamilyForId(settings.bodyFont || "inter");

  root.style.setProperty("--font-ui", uiFont);
  root.style.setProperty("--font-heading", headingFont);
  root.style.setProperty("--font-body", bodyFont);

  // Card Height
  if (settings.productCardHeightMode === "AUTO") {
    root.style.setProperty("--product-card-height", "auto");
  } else if (settings.productCardHeightMode === "CUSTOM" && settings.productCardHeight) {
    root.style.setProperty("--product-card-height", `${settings.productCardHeight}px`);
  } else {
    // COMPACT default: 390px
    root.style.setProperty("--product-card-height", "390px");
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
