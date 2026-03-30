"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api-client";
import type { LoginCredentials } from "@/features/auth/types";
import { login, getStoredToken } from "@/features/auth/services";
import { useAuth } from "@/features/auth/context";

export function useLogin() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(credentials);
      const stored = getStoredToken();
      console.log(stored,"storeddddddddddd")
      setToken(stored ?? "session");
      router.push("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return { login: handleLogin, isLoading, error };
}
