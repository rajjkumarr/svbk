/**
 * Auth service – business logic. Calls api layer only; handles token storage.
 * Token/JWT is optional: when authConfig.useTokenAuth is false, no token is stored or sent.
 * JWT: when authConfig.useJwtRefresh is true, add refresh-token storage and refresh logic here.
 */

import { setAuthTokenGetter } from "@/lib/api-client";
import { authConfig } from "@/features/auth/config";
import type { LoginCredentials, LoginResponse } from "@/features/auth/types";
import { verifyLoginApi } from "@/features/auth/api/auth.api";
import {
  STORAGE_KEY,
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/storage";

function readToken(): string | null {
  return getStorageItem<string>(STORAGE_KEY.authToken);
}

function writeToken(token: string): void {
  setStorageItem<string>(STORAGE_KEY.authToken, token);
}

function removeToken(): void {
  removeStorageItem(STORAGE_KEY.authToken);
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

export function getStoredUser(): LoginResponse["user"] | null {
  return getStorageItem<LoginResponse["user"]>(STORAGE_KEY.userDetails);
}

export function setStoredUser(user: LoginResponse["user"] | null): void {
  if (user) setStorageItem<LoginResponse["user"]>(STORAGE_KEY.userDetails, user);
  else removeStorageItem(STORAGE_KEY.userDetails);
}

export function clearStoredUser(): void {
  removeStorageItem(STORAGE_KEY.userDetails);
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const body = {
    email: credentials.email.trim(),
    password: credentials.password,
  };
  const res:any = await verifyLoginApi(body);
  const token =
    res.accessToken ??
    (res as { token?: string }).token ??
    (res as { data?: { accessToken?: string; token?: string } }).data?.accessToken ??
    (res as { data?: { accessToken?: string; token?: string } }).data?.token;
  if (authConfig.useTokenAuth && token) {
    console.log(authConfig.useTokenAuth, "authConfig.useTokenAuth",token)
    writeToken(token);
  }

  if (res?.data) {
    setStoredUser(res.data);
  }

  return res;
}

export async function logout(): Promise<void> {
  clearStoredToken();
  clearStoredUser();
}


// export async function logout(): Promise<void> {
//   removeToken();
// }
