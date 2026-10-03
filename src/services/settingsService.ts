import { StoreSettings, HomepageSetting, SiteAppearanceSetting, DEFAULT_SITE_APPEARANCE } from "@/types/settings";
import { INITIAL_SETTINGS } from "./mockData";

const SETTINGS_KEY = "dg_store_settings";
const HOMEPAGE_SETTINGS_KEY = "dg_homepage_settings";
const APPEARANCE_SETTINGS_KEY = "dg_appearance_settings";

function getLocalAppearanceSettings(): SiteAppearanceSetting {
  if (typeof window === "undefined") return DEFAULT_SITE_APPEARANCE;
  try {
    const data = localStorage.getItem(APPEARANCE_SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SITE_APPEARANCE;
  } catch {
    return DEFAULT_SITE_APPEARANCE;
  }
}

function saveLocalAppearanceSettings(settings: SiteAppearanceSetting) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(APPEARANCE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save appearance settings", e);
  }
}

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSetting = {
  heroImage: undefined,
  heroImageAlt: "Premium Digital Products & Subscriptions",
  heroImageFit: "cover",
  heroImageEnabled: true,
};

function getLocalSettings(): StoreSettings {
  if (typeof window === "undefined") return INITIAL_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

function saveLocalSettings(settings: StoreSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
}

function getLocalHomepageSettings(): HomepageSetting {
  if (typeof window === "undefined") return DEFAULT_HOMEPAGE_SETTINGS;
  try {
    const data = localStorage.getItem(HOMEPAGE_SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_HOMEPAGE_SETTINGS;
  } catch {
    return DEFAULT_HOMEPAGE_SETTINGS;
  }
}

function saveLocalHomepageSettings(settings: HomepageSetting) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HOMEPAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save homepage settings", e);
  }
}

export const settingsService = {
  getSettings: async (): Promise<StoreSettings> => {
    return getLocalSettings();
  },

  updateSettings: async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
    const current = getLocalSettings();
    const updated = { ...current, ...settings };
    saveLocalSettings(updated);
    return updated;
  },

  // Public Homepage Settings
  getHomepageSettings: async (): Promise<HomepageSetting> => {
    return getLocalHomepageSettings();
  },

  // Admin Homepage Settings
  getAdminHomepageSettings: async (): Promise<HomepageSetting> => {
    return getLocalHomepageSettings();
  },

  updateHomepageSettings: async (settings: Partial<HomepageSetting>): Promise<HomepageSetting> => {
    const current = getLocalHomepageSettings();
    const updated = { ...current, ...settings };
    saveLocalHomepageSettings(updated);
    return updated;
  },

  uploadHeroImage: async (file: File): Promise<HomepageSetting> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const current = getLocalHomepageSettings();
        const updated: HomepageSetting = {
          ...current,
          heroImage: {
            secureUrl: dataUrl,
            publicId: `hero-${Date.now()}`,
          },
          heroImageEnabled: true,
        };
        saveLocalHomepageSettings(updated);
        resolve(updated);
      };
      reader.readAsDataURL(file);
    });
  },

  deleteHeroImage: async (): Promise<HomepageSetting> => {
    const current = getLocalHomepageSettings();
    const updated: HomepageSetting = {
      ...current,
      heroImage: undefined,
      heroImageEnabled: false,
    };
    saveLocalHomepageSettings(updated);
    return updated;
  },

  // Public Appearance Settings
  getAppearanceSettings: async (): Promise<SiteAppearanceSetting> => {
    return getLocalAppearanceSettings();
  },

  // Admin Appearance Settings
  getAdminAppearanceSettings: async (): Promise<SiteAppearanceSetting> => {
    return getLocalAppearanceSettings();
  },

  updateAppearanceSettings: async (settings: Partial<SiteAppearanceSetting>): Promise<SiteAppearanceSetting> => {
    const current = getLocalAppearanceSettings();
    const updated = { ...current, ...settings };
    saveLocalAppearanceSettings(updated);
    return updated;
  },
};
