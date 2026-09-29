import { create } from "zustand";
import { Product, ProductPlan } from "@/types/product";

export interface CartItem {
  id: string; // unique item id (productId + planId)
  product: Product;
  selectedPlan: ProductPlan;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  discountAmount: number;
  isOpen: boolean;
  addItem: (product: Product, plan: ProductPlan, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

const CART_STORAGE_KEY = "dg_shopping_cart";

function loadSavedCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save cart", e);
  }
}

export const useCart = create<CartState>((set, get) => ({
  items: typeof window !== "undefined" ? loadSavedCart() : [],
  couponCode: "",
  discountAmount: 0,
  isOpen: false,

  addItem: (product, plan, quantity = 1) => {
    const items = get().items;
    const itemId = `${product.id}-${plan.id}`;
    const existingIndex = items.findIndex((i) => i.id === itemId);

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems = [
        ...items,
        {
          id: itemId,
          product,
          selectedPlan: plan,
          quantity,
        },
      ];
    }

    set({ items: updatedItems, isOpen: true });
    saveCart(updatedItems);
  },

  removeItem: (itemId) => {
    const filtered = get().items.filter((i) => i.id !== itemId);
    set({ items: filtered });
    saveCart(filtered);
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const updated = get().items.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    );
    set({ items: updated });
    saveCart(updated);
  },

  clearCart: () => {
    set({ items: [], couponCode: "", discountAmount: 0 });
    saveCart([]);
  },

  applyCoupon: (code, discount) => {
    set({ couponCode: code, discountAmount: discount });
  },

  removeCoupon: () => {
    set({ couponCode: "", discountAmount: 0 });
  },

  setOpen: (open) => set({ isOpen: open }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (total, item) => total + item.selectedPlan.salePrice * item.quantity,
      0
    );
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, subtotal - get().discountAmount);
  },
}));
