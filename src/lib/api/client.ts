import axios, { AxiosInstance } from "axios";

export const getBaseUrl = (): string => "";

// Safe inert client for standalone frontend
export const apiClient: AxiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});
