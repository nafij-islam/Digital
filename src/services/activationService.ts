import { ActivationProcess } from "@/types/activation";

const ACTIVATION_STORAGE_KEY = "dg_activation_processes";

function getActivationMap(): Record<string, ActivationProcess> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ACTIVATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveActivationMap(map: Record<string, ActivationProcess>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVATION_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Failed to save activation processes", e);
  }
}

export const activationService = {
  // Customer: get activation process for an order
  getCustomerActivationProcess: async (orderId: string): Promise<ActivationProcess | null> => {
    const map = getActivationMap();
    return map[orderId] || null;
  },

  // Admin: get activation process
  getAdminActivationProcess: async (orderId: string): Promise<ActivationProcess | null> => {
    const map = getActivationMap();
    return map[orderId] || null;
  },

  // Admin: create or update activation process
  saveAdminActivationProcess: async (
    orderId: string,
    payload: {
      title?: string;
      subtitle?: string;
      blocks: ActivationProcess["blocks"];
    }
  ): Promise<ActivationProcess> => {
    const map = getActivationMap();
    const existing = map[orderId];
    const updated: ActivationProcess = {
      id: existing?.id || `act-${Date.now()}`,
      orderId,
      title: payload.title || existing?.title || "Product Activation Guide",
      subtitle: payload.subtitle || existing?.subtitle || "Follow these steps to activate your digital subscription.",
      blocks: payload.blocks,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    map[orderId] = updated;
    saveActivationMap(map);
    return updated;
  },
};
