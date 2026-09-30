import { create } from "zustand";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { authService } from "@/services/authService";
import { tokenStorage } from "@/lib/auth/token";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  initializeAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,

  initializeAuth: async () => {
    const token = tokenStorage.getToken();
    if (!token) {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });
      return;
    }

    try {
      const user = await authService.fetchMe();
      if (user) {
        const isAdmin = user.role === "admin" || user.role === "superadmin";
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin,
          isLoading: false,
        });
      } else {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isAdmin: response.user.role === "admin" || response.user.role === "superadmin",
        isLoading: false,
      });
      return response.user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { signInWithGoogle } = await import("@/lib/auth/firebase");
      const { idToken } = await signInWithGoogle();
      const response = await authService.loginWithGoogle(idToken);
      const roleStr = String(response.user.role || "").toLowerCase();
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isAdmin: roleStr.includes("admin"),
        isLoading: false,
      });
      return response.user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(credentials);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isAdmin: false,
        isLoading: false,
      });
      return response.user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },

  updateProfile: async (data) => {
    const updated = await authService.updateProfile(data);
    set({ user: updated });
    return updated;
  },
}));
