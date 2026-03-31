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
      const data:any=await login(credentials);
     
      const stored = getStoredToken();
      setToken(stored ?? "session");
       if(data.data.role==="Admin"){
        router.push("/tenants")
        
      }else{
        router.push("/dashboard");
      }
      // router.push("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return { login: handleLogin, isLoading, error };
}
function setUser(arg0: { id: string; email: string; name?: string; } | null) {
  throw new Error("Function not implemented.");
}

