"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SiteAppearanceSetting, DEFAULT_SITE_APPEARANCE } from "@/types/settings";
import { settingsService } from "@/services/settingsService";

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

function applyThemeVariables(settings: SiteAppearanceSetting) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

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
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<SiteAppearanceSetting>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(APPEARANCE_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.backgroundColor) return parsed;
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
        setAppearance(data);
        setActiveTheme(data);
        applyThemeVariables(data);
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
