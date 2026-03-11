"use client";

export function DashboardMain({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`flex-1 overflow-auto px-6 py-8 md:px-8 md:py-10 ${className}`}
      style={{ backgroundColor: "var(--app-search-bg)" }}
    >
      {children}
    </main>
  );
}
