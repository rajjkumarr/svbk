/**
 * Auth service – business logic. Calls api layer only; handles token storage.
 * Token/JWT is optional: when authConfig.useTokenAuth is false, no token is stored or sent.
 * JWT: when authConfig.useJwtRefresh is true, add refresh-token storage and refresh logic here.
 */

import { setAuthTokenGetter } from "@/lib/api-client";
import { authConfig } from "@/features/auth/config";
import type { LoginCredentials, LoginResponse } from "@/features/auth/types";
import { verifyLoginApi } from "@/features/auth/api/auth.api";

const TOKEN_KEY = "auth_token";

function readToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function writeToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

if (authConfig.useTokenAuth) {
  setAuthTokenGetter(readToken);
}

export function getStoredToken(): string | null {
  return readToken();
}

export function setStoredToken(token: string | null): void {
  if (token) writeToken(token);
  else removeToken();
}

export function clearStoredToken(): void {
  removeToken();
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const body = {
    email: credentials.email.trim(),
    password: credentials.password,
  };
  const res = await verifyLoginApi(body);
  const token =
    res.accessToken ??
    (res as { token?: string }).token ??
    (res as { data?: { accessToken?: string; token?: string } }).data?.accessToken ??
    (res as { data?: { accessToken?: string; token?: string } }).data?.token;
  if (authConfig.useTokenAuth && token) {
    writeToken(token);
  }
  return res;
}

export async function logout(): Promise<void> {
  removeToken();
}
