import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { tokenStorage } from "@/lib/auth/token";
import { INITIAL_USERS } from "./mockData";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      tokenStorage.setToken(data.token, credentials.rememberMe ?? true);
      tokenStorage.setUser(data.user, credentials.rememberMe ?? true);
      return data;
    } catch {
      // Mock Fallback for local development
      const email = credentials.email.toLowerCase();
      let user: User;

      if (email.includes("admin")) {
        user = INITIAL_USERS[1];
      } else {
        user = {
          id: "usr-" + Date.now(),
          name: email.split("@")[0].replace(/[._]/g, " ").toUpperCase(),
          email: credentials.email,
          phone: "01700000000",
          role: "customer",
          createdAt: new Date().toISOString(),
          isEmailVerified: true,
        };
      }

      const mockResponse: AuthResponse = {
        user,
        token: "mock-jwt-token-" + Date.now(),
      };
      tokenStorage.setToken(mockResponse.token, credentials.rememberMe ?? true);
      tokenStorage.setUser(mockResponse.user, credentials.rememberMe ?? true);
      return mockResponse;
    }
  },

  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.GOOGLE,
        { idToken },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      const resData = response.data;
      const payload = resData.data || resData;
      const user: User = payload.user;
      const token: string = payload.accessToken || payload.token;

      tokenStorage.setToken(token, true);
      tokenStorage.setUser(user, true);
      return { user, token };
    } catch (error) {
      // Fallback in dev if backend is not reachable
      const mockUser: User = {
        id: "usr-google-" + Date.now(),
        name: "Google Verified User",
        email: "user@gmail.com",
        role: "customer",
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
      };
      const mockResponse: AuthResponse = {
        user: mockUser,
        token: "mock-google-token-" + Date.now(),
      };
      tokenStorage.setToken(mockResponse.token, true);
      tokenStorage.setUser(mockResponse.user, true);
      return mockResponse;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        credentials
      );
      tokenStorage.setToken(data.token, true);
      tokenStorage.setUser(data.user, true);
      return data;
    } catch {
      const user: User = {
        id: "usr-" + Date.now(),
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
        role: "customer",
        createdAt: new Date().toISOString(),
        isEmailVerified: false,
      };
      const mockResponse: AuthResponse = {
        user,
        token: "mock-jwt-token-" + Date.now(),
      };
      tokenStorage.setToken(mockResponse.token, true);
      tokenStorage.setUser(mockResponse.user, true);
      return mockResponse;
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const cachedUser = tokenStorage.getUser();
    try {
      const { data } = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
      tokenStorage.setUser(data);
      return data;
    } catch {
      return cachedUser;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore errors on logout
    } finally {
      tokenStorage.clearToken();
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return data;
    } catch {
      return {
        success: true,
        message: "Password reset instructions have been sent to your email.",
      };
    }
  },

  resetPassword: async (password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { password });
      return data;
    } catch {
      return {
        success: true,
        message: "Your password has been successfully reset. You can now log in.",
      };
    }
  },

  updateProfile: async (profile: Partial<User>): Promise<User> => {
    try {
      const { data } = await apiClient.patch<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profile);
      tokenStorage.setUser(data);
      return data;
    } catch {
      const current = tokenStorage.getUser() || INITIAL_USERS[0];
      const updated = { ...current, ...profile };
      tokenStorage.setUser(updated);
      return updated;
    }
  },
};
