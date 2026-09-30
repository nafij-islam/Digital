import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../auth/token";
import { auth } from "../auth/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://digital-backend-gamma.vercel.app/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 25000,
});

// Request interceptor for attaching fresh auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // 1. Prefer fresh Firebase ID token if user is signed in via Firebase
      if (typeof window !== "undefined" && auth?.currentUser) {
        const freshToken = await auth.currentUser.getIdToken();
        if (freshToken && config.headers) {
          config.headers.Authorization = `Bearer ${freshToken}`;
          return config;
        }
      }
    } catch {
      // Fall through to stored token
    }

    // 2. Fallback to cached token in storage
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401, 403, and standardized API errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Clear token on authentication failure
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          // Don't loop redirect if already on login
          if (!currentPath.includes("/login") && !currentPath.includes("/admin/login")) {
            tokenStorage.clearToken();
            if (currentPath.startsWith("/admin")) {
              window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
            } else if (currentPath.startsWith("/account")) {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
          }
        }
      }

      if (status === 403) {
        console.warn("Access forbidden (403): You lack sufficient permissions.");
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath.startsWith("/admin") && !currentPath.includes("/admin/login")) {
            window.location.href = "/account";
          }
        }
      }

      // Return a normalized error object
      const data: any = error.response.data;
      const message =
        data?.message || data?.error || error.message || "An unexpected error occurred";

      return Promise.reject({
        status,
        message,
        errors: data?.errors || null,
      });
    }

    if (error.request) {
      // Network error or server offline
      return Promise.reject({
        status: 0,
        message: "Network error: Unable to reach the server. Please check your connection.",
      });
    }

    return Promise.reject({
      status: 500,
      message: error.message || "An unexpected error occurred",
    });
  }
);
