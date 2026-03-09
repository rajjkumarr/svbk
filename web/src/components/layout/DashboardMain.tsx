"use client";

import { useUi } from "@/context/ui-context";

export function DashboardMain({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { sidebarCollapsed } = useUi();
  const marginClass = sidebarCollapsed ? "md:ml-20" : "md:ml-72";
  return (
    <main
      className={`flex-1 overflow-auto px-6 py-8 md:px-8 md:py-10 ${marginClass} ${className}`}
      style={{ backgroundColor: "var(--app-search-bg)" }}
    >
      {children}
    </main>
  );
}
