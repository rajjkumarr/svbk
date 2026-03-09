"use client";

import { useState } from "react";
import { ViewPageContent } from "@/app/(dashboard)/view/ViewPageContent";
import { UploadPageContent } from "./UploadPageContent";

const TABS = [
  { id: "view", label: "View" },
  { id: "upload", label: "Upload" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function StudentsPageContent() {
  const [activeTab, setActiveTab] = useState<TabId>("view");

  return (
    <div className="space-y-1">
      {/* Header with tabs on the right */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--app-text-primary)" }}>
          Students
        </h1>
        <div
          className="flex items-center gap-1 rounded-xl border p-1"
          style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)" }}
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? "shadow-sm"
                  : "hover:bg-[var(--app-nav-hover-bg)]"
              }`}
              style={
                activeTab === id
                  ? { backgroundColor: "var(--app-card-bg)", color: "var(--app-text-primary)" }
                  : { color: "var(--app-text-secondary)" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "view" && <ViewPageContent />}
      {activeTab === "upload" && <UploadPageContent />}
    </div>
  );
}
