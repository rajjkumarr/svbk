"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUi } from "@/context/ui-context";
import { useAuth } from "@/features/auth";
import { SidebarBrand } from "./SidebarBrand";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/templates", label: "Templates", icon: "document" },
  { href: "/save-media", label: "Save Media", icon: "save" },
  { href: "/media", label: "View Media", icon: "media" },
  { href: "/announcements", label: "Announcements", icon: "megaphone" },
  { href: "/students", label: "Students", icon: "students" },
  { href: "/pay-now", label: "Pay Now", icon: "payment" },
] as const;

const transitionClass = "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

function NavIcon({ name }: { name: string }) {
  const className = "h-5 w-5 flex-shrink-0";
  if (name === "grid")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    );
  if (name === "document")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  if (name === "save")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    );
  if (name === "media")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  if (name === "megaphone")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13a3 3 0 005.064 0M18 13a3 3 0 01-3 3h-6a3 3 0 01-3-3M18 7a3 3 0 00-3-3h-6a3 3 0 00-3 3" />
      </svg>
    );
  if (name === "upload")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    );
  if (name === "view")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );
  if (name === "students")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  if (name === "template-add")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  if (name === "payment")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    );
  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapsed } = useUi();
  const { logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <div
        role="presentation"
        aria-hidden={!sidebarOpen}
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col shadow-xl ${transitionClass} ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          sidebarCollapsed ? "w-20" : "w-72"
        } max-w-[85vw]`}
        style={{
          backgroundColor: "var(--app-sidebar-bg)",
          borderRight: "1px solid var(--app-sidebar-border)",
        }}
        aria-label="Main navigation"
      >
        <div
          className={`flex items-center gap-3 border-b px-2 py-4 ${transitionClass}`}
          style={{ borderColor: "var(--app-sidebar-border)" }}
        >
          {sidebarCollapsed ? (
            <div className="flex w-full justify-center">
              <SidebarBrand />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={closeSidebar}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-[background-color,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--app-nav-hover-bg)] hover:opacity-90 md:hidden"
                style={{ color: "var(--app-nav-icon)" }}
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <SidebarBrand />
            </>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
          {navItems.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`flex items-center gap-4 rounded-xl px-2 py-3 text-base font-medium ${transitionClass} ${
                  sidebarCollapsed ? "justify-center px-0" : "gap-4 px-4"
                } ${active ? "" : "hover:bg-[var(--app-nav-hover-bg)]"}`}
                style={
                  active
                    ? { backgroundColor: "#e0f2fe", color: "#1e58b4" }
                    : { color: "var(--app-sidebar-text)" }
                }
                title={sidebarCollapsed ? label : undefined}
              >
                <NavIcon name={icon} />
                {!sidebarCollapsed && label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t px-2 py-4" style={{ borderColor: "var(--app-sidebar-border)" }}>
          <button
            type="button"
            onClick={() => { setSidebarOpen(false); toggleSidebarCollapsed(); }}
            className={`flex w-full items-center gap-4 rounded-xl px-2 py-3 text-base font-medium ${transitionClass} hover:bg-[var(--app-nav-hover-bg)] ${
              sidebarCollapsed ? "justify-center px-0" : "px-4"
            }`}
            style={{ color: "var(--app-sidebar-text)" }}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? "rotate-180" : ""} ${transitionClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!sidebarCollapsed && "Collapse Sidebar"}
          </button>
          <button
            type="button"
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className={`mt-2 flex w-full items-center gap-4 rounded-xl px-2 py-3 text-base font-medium ${transitionClass} hover:opacity-90 ${
              sidebarCollapsed ? "justify-center px-0" : "px-4"
            }`}
            style={{ color: "var(--app-danger-text)" }}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
