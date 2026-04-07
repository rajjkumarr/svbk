"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppImage } from "@/components/ui";
import { LoginForm } from "@/features/auth";
import { useAuth } from "@/features/auth";
import { getStorageItem } from "@/storage";


const LOGO_SRC = "/svbk_logo.webp";

export function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
 const data:any = getStorageItem("userDetails")
  console.log(data,"qqqqq")
  useEffect(() => {
    if (isAuthenticated ) {
      if(data?.role==="Admin"){
        router.replace("/tenants")
      }else{

        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-media">
          <AppImage
            src={LOGO_SRC}
            alt="SVBK - Sri Venkateswara Bala Kuteer, Guntur"
            variant="panel"
            priority
          />
        </div>
        <div className="auth-card-form">
          <AppImage
            src={LOGO_SRC}
            alt="SVBK Logo"
            variant="icon"
            wrapperClassName="mx-auto mb-6 md:hidden"
            priority
          />
          <LoginForm showBackLink={false} />
        </div>
      </div>
    </div>
  );
}
