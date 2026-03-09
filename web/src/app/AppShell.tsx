"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { Navbar } from "@/components/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isLoginPage = pathname === "/";
  const showAppShell = isAuthenticated || !isLoginPage;

  if (!showAppShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
