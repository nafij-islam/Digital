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
  initializeAuth: () => Promise<void>;
}

// Client-side initial hydration to prevent Navbar flash & avoid false redirect loops
const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  const token = tokenStorage.getToken();
  const user = tokenStorage.getUser();
  const isAuthenticated = !!token && !!user;
  const role = String(user?.role || "").toLowerCase();
  const isAdmin = isAuthenticated && (role === "admin" || role === "superadmin");

  return {
    user,
    token,
    isLoading: false,
    isAuthenticated,
    isAdmin,
  };
};

export const useAuth = create<AuthState>((set, get) => ({
  ...getInitialState(),

  initializeAuth: async () => {
    const token = tokenStorage.getToken();
    const cachedUser = tokenStorage.getUser();

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

    // Immediately hydrate to prevent UI flash
    if (cachedUser) {
      const role = String(cachedUser.role || "").toLowerCase();
      set({
        token,
        user: cachedUser,
        isAuthenticated: true,
        isAdmin: role === "admin" || role === "superadmin",
        isLoading: false,
      });
    }

    try {
      const user = await authService.fetchMe();
      if (user) {
        const role = String(user.role || "").toLowerCase();
        const isAdmin = role === "admin" || role === "superadmin";
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin,
          isLoading: false,
        });
      } else {
        // If fetchMe returned null and token was cleared
        if (!tokenStorage.getToken()) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      }
    } catch {
      // If error occurs, check if token was invalidated
      if (!tokenStorage.getToken()) {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      const roleStr = String(response.user.role || "").toLowerCase();
      const isAdmin = roleStr === "admin" || roleStr === "superadmin";

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isAdmin,
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
      const roleStr = String(response.user.role || "").toLowerCase();

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isAdmin: roleStr === "admin" || roleStr === "superadmin",
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
