"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getStoredToken,
  clearStoredToken,
  setStoredToken,
} from "@/features/auth/services";

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  logout: () => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTokenState(getStoredToken());
    setMounted(true);
  }, []);

  const setToken = useCallback((value: string | null) => {
    setStoredToken(value);
    setTokenState(value);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setTokenState(null);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated: !!token,
    token,
    logout,
    setToken,
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
