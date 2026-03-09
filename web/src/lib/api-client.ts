/**
 * Global API client (Axios). Used only by feature api layers.
 * Request interceptor: attach auth token when setAuthTokenGetter is used (optional).
 * Response interceptor: normalize errors. JWT: add 401 + refresh-token retry here when useJwtRefresh is true.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { env } from "./env";

export interface ApiError {
  message: string;
  statusCode: number;
}

/** Extract user-facing message from thrown API error. Use in hooks for consistent UX. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error && typeof error === "object" && "message" in error && typeof (error as ApiError).message === "string") {
    return (error as ApiError).message;
  }
  return fallback;
}

/** Optional: set by auth feature when useTokenAuth is true. If unset, no Authorization header is sent. */
let getAuthToken: (() => string | null) | null = null;

export function setAuthTokenGetter(fn: () => string | null): void {
  getAuthToken = fn;
}

const baseURL = env.apiBaseUrl.replace(/\/$/, "") || env.apiBaseUrl;

const client: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

client.interceptors.request.use((config) => {
  const token = getAuthToken?.();
  if (token && token !== "session") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status ?? 500;
    const data = error.response?.data;
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : typeof data?.errorMessage === "string"
            ? data.errorMessage
            : error.message || "Request failed";
    return { message, statusCode };
  }
  return {
    message: error instanceof Error ? error.message : "Request failed",
    statusCode: 500,
  };
}

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return client.get<T>(url, config).then((res) => res.data);
}

export function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  return client.post<T>(url, data, config).then((res) => res.data);
}

export function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  return client.put<T>(url, data, config).then((res) => res.data);
}

export function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  return client.patch<T>(url, data, config).then((res) => res.data);
}

export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return client.delete<T>(url, config).then((res) => res.data);
}

export { client as apiClient };
