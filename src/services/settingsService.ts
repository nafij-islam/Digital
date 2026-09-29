import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
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
    try {
      const { data } = await apiClient.get<StoreSettings>(API_ENDPOINTS.ADMIN.SETTINGS.GET);
      return data;
    } catch {
      return getLocalSettings();
    }
  },

  updateSettings: async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
    try {
      const { data } = await apiClient.put<StoreSettings>(
        API_ENDPOINTS.ADMIN.SETTINGS.UPDATE,
        settings
      );
      return data;
    } catch {
      const current = getLocalSettings();
      const updated = { ...current, ...settings };
      saveLocalSettings(updated);
      return updated;
    }
  },

  // Public Homepage Settings
  getHomepageSettings: async (): Promise<HomepageSetting> => {
    try {
      const { data } = await apiClient.get<HomepageSetting>(API_ENDPOINTS.SETTINGS.HOMEPAGE);
      return data;
    } catch {
      return getLocalHomepageSettings();
    }
  },

  // Admin Homepage Settings
  getAdminHomepageSettings: async (): Promise<HomepageSetting> => {
    try {
      const { data } = await apiClient.get<HomepageSetting>(API_ENDPOINTS.ADMIN.SETTINGS.HOMEPAGE);
      return data;
    } catch {
      return getLocalHomepageSettings();
    }
  },

  updateHomepageSettings: async (settings: Partial<HomepageSetting>): Promise<HomepageSetting> => {
    try {
      const { data } = await apiClient.patch<HomepageSetting>(
        API_ENDPOINTS.ADMIN.SETTINGS.HOMEPAGE,
        settings
      );
      return data;
    } catch {
      const current = getLocalHomepageSettings();
      const updated = { ...current, ...settings };
      saveLocalHomepageSettings(updated);
      return updated;
    }
  },

  uploadHeroImage: async (file: File): Promise<HomepageSetting> => {
    const formData = new FormData();
    formData.append("heroImage", file);

    const { data } = await apiClient.post<HomepageSetting>(
      API_ENDPOINTS.ADMIN.SETTINGS.HERO_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  deleteHeroImage: async (): Promise<HomepageSetting> => {
    const { data } = await apiClient.delete<HomepageSetting>(API_ENDPOINTS.ADMIN.SETTINGS.HERO_IMAGE);
    return data;
  },

  // Public Appearance Settings
  getAppearanceSettings: async (): Promise<SiteAppearanceSetting> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.SETTINGS.APPEARANCE);
      const payload = response.data?.data || response.data;
      if (payload && payload.backgroundColor) {
        saveLocalAppearanceSettings(payload);
        return payload;
      }
      return getLocalAppearanceSettings();
    } catch {
      return getLocalAppearanceSettings();
    }
  },

  // Admin Appearance Settings
  getAdminAppearanceSettings: async (): Promise<SiteAppearanceSetting> => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.ADMIN.SETTINGS.APPEARANCE);
      const payload = response.data?.data || response.data;
      if (payload && payload.backgroundColor) {
        saveLocalAppearanceSettings(payload);
        return payload;
      }
      return getLocalAppearanceSettings();
    } catch {
      return getLocalAppearanceSettings();
    }
  },

  updateAppearanceSettings: async (settings: Partial<SiteAppearanceSetting>): Promise<SiteAppearanceSetting> => {
    try {
      const response = await apiClient.patch<any>(
        API_ENDPOINTS.ADMIN.SETTINGS.APPEARANCE,
        settings
      );
      const payload = response.data?.data || response.data;
      const current = getLocalAppearanceSettings();
      const updated = { ...current, ...(payload && payload.backgroundColor ? payload : settings) };
      saveLocalAppearanceSettings(updated);
      return updated;
    } catch {
      const current = getLocalAppearanceSettings();
      const updated = { ...current, ...settings };
      saveLocalAppearanceSettings(updated);
      return updated;
    }
  },
};
