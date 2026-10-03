import { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { tokenStorage } from "@/lib/auth/token";
import { INITIAL_USERS } from "./mockData";

const REGISTERED_USERS_KEY = "dg_registered_users";

function getRegisteredUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(user: User) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRegisteredUsers();
    const filtered = existing.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([user, ...filtered]));
  } catch (e) {
    console.error("Failed to save registered user", e);
  }
}

export const getBaseUrl = (): string => "";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const email = (credentials.email || "").trim().toLowerCase();
    const isDemoAdmin =
      email === "admin@digivault.shop" ||
      email === "admin@shop.nafij.com" ||
      email.includes("admin");

    const isDemoCustomer = email === "nafij@example.com";

    let user: User;

    if (isDemoAdmin) {
      user = { ...INITIAL_USERS[1], email: email || INITIAL_USERS[1].email };
    } else if (isDemoCustomer) {
      user = INITIAL_USERS[0];
    } else {
      const registered = getRegisteredUsers();
      const found = registered.find((u) => u.email.toLowerCase() === email);
      if (found) {
        user = found;
      } else {
        // Auto-create local account for seamless front-end experience
        user = {
          id: `usr-${Date.now()}`,
          name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          phone: "01700000000",
          role: "customer",
          createdAt: new Date().toISOString(),
          isEmailVerified: true,
        };
        saveRegisteredUser(user);
      }
    }

    const token = "auth-token-" + Date.now();
    tokenStorage.setToken(token, credentials.rememberMe ?? true);
    tokenStorage.setUser(user, credentials.rememberMe ?? true);

    return { user, token };
  },

  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    const user = INITIAL_USERS[0];
    const token = idToken || "google-token-" + Date.now();
    tokenStorage.setToken(token, true);
    tokenStorage.setUser(user, true);
    return { user, token };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const email = credentials.email.trim().toLowerCase();
    const isAdmin = email.includes("admin");

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: credentials.name.trim(),
      email,
      phone: credentials.phone || "01700000000",
      role: isAdmin ? "admin" : "customer",
      createdAt: new Date().toISOString(),
      isEmailVerified: true,
    };

    saveRegisteredUser(newUser);

    const token = "register-token-" + Date.now();
    tokenStorage.setToken(token, true);
    tokenStorage.setUser(newUser, true);

    return { user: newUser, token };
  },

  fetchMe: async (): Promise<User | null> => {
    const token = tokenStorage.getToken();
    if (!token) return null;
    return tokenStorage.getUser();
  },

  getCurrentUser: async (): Promise<User | null> => {
    return authService.fetchMe();
  },

  logout: async (): Promise<void> => {
    tokenStorage.clearToken();
  },

  forgotPassword: async (_email: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: "If an account exists with that email, password reset instructions have been sent.",
    };
  },

  resetPassword: async (_password: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: "Your password has been successfully reset. You can now log in.",
    };
  },

  updateProfile: async (profile: Partial<User>): Promise<User> => {
    const current = tokenStorage.getUser() || INITIAL_USERS[0];
    const updated: User = { ...current, ...profile };
    tokenStorage.setUser(updated);
    saveRegisteredUser(updated);
    return updated;
  },
};
