/**
 * Auth feature – API layer (backend endpoint calls only).
 * Uses global api-client from lib. No business logic here.
 */

import { post } from "@/lib/api-client";
import type { LoginResponse } from "@/features/auth/types";

const AUTH_ENDPOINTS = {
  verifyLogin: "/studentsDetails/verifyLogin",
  logout: "/logout",
  refreshToken: "/refresh",
} as const;

export async function verifyLoginApi(
  body: { email: string; password: string }
): Promise<LoginResponse> {
  return post<LoginResponse, typeof body>(AUTH_ENDPOINTS.verifyLogin, body);
}

// export async function logoutApi(): Promise<void> {
//   return post(AUTH_ENDPOINTS.logout);
// }

/** JWT: uncomment and use when backend supports refresh. */
// export async function refreshTokenApi(refreshToken: string): Promise<LoginResponse> {
//   return post(AUTH_ENDPOINTS.refreshToken, { refreshToken });
// }
