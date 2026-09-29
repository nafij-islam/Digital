const ACCESS_TOKEN_KEY = "dg_access_token";
const USER_KEY = "dg_auth_user";

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string, remember: boolean = true) => {
    if (typeof window === "undefined") return;
    try {
      if (remember) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      }
    } catch (e) {
      console.error("Failed to save auth token", e);
    }
  },

  clearToken: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Failed to clear auth token", e);
    }
  },

  getUser: (): any | null => {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: any, remember: boolean = true) => {
    if (typeof window === "undefined") return;
    try {
      const serialized = JSON.stringify(user);
      if (remember) {
        localStorage.setItem(USER_KEY, serialized);
      } else {
        sessionStorage.setItem(USER_KEY, serialized);
      }
    } catch (e) {
      console.error("Failed to save user session", e);
    }
  },
};
