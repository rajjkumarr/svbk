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
  getStoredUser,
  clearStoredToken,
  clearStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/features/auth/services";

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  user: ReturnType<typeof getStoredUser>;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: ReturnType<typeof getStoredUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<ReturnType<typeof getStoredUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTokenState(getStoredToken());
    setUserState(getStoredUser());
    setMounted(true);
  }, []);

  const setToken = useCallback((value: string | null) => {
    setStoredToken(value);
    setTokenState(value);
  }, []);

  const setUser = useCallback((value: ReturnType<typeof getStoredUser>) => {
    setStoredUser(value);
    setUserState(value);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    clearStoredUser();
    setTokenState(null);
    setUserState(null);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated: !!token,
    token,
    user,
    logout,
    setToken,
    setUser,
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
  console.log(ctx,"kkkkkkkk")
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
