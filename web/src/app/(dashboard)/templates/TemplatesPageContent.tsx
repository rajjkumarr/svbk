"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchTemplates } from "@/features/templates";
import type { Template } from "@/features/templates";

const TABS = [
  { id: "approved" as const, label: "Approved" },
  { id: "rejected" as const, label: "Rejected" },
];

type TabId = "approved" | "rejected";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: "approved" | "rejected" }) {
  const isApproved = status === "approved";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: isApproved ? "var(--app-success-bg, #dcfce7)" : "var(--app-danger-bg, #fee2e2)",
        color: isApproved ? "var(--app-success-text, #166534)" : "var(--app-danger-text, #991b1b)",
      }}
    >
      {isApproved ? "Approved" : "Rejected"}
    </span>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border p-4 transition-shadow hover:shadow-md"
      style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" style={{ color: "var(--app-text-primary)" }}>
            {template.name}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--app-text-secondary)" }}>
            {template.category} &middot; {template.language}
          </p>
        </div>
        <StatusBadge status={template.status} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px]" style={{ color: "var(--app-text-secondary)" }}>
          Created {formatDate(template.createdAt)}
        </p>
        <button
          type="button"
          className="text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--app-brand)" }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export function TemplatesPageContent() {
  const { data: templates, loading, error } = useFetchTemplates();
  const [activeTab, setActiveTab] = useState<TabId>("approved");
  const router = useRouter();

  const filtered = templates.filter((t) => t.status === activeTab);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--app-text-primary)" }}>
          Templates
        </h1>
        <div className="flex items-center gap-3">
          {/* Tabs */}
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
                  activeTab === id ? "shadow-sm" : "hover:bg-[var(--app-nav-hover-bg)]"
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

          {/* Add Template */}
          <button
            type="button"
            onClick={() => router.push("/templates/save-template")}
            className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--app-brand)" }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Template
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm" style={{ color: "var(--app-text-secondary)" }}>
        {loading ? "Loading..." : `${filtered.length} ${activeTab} template${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border p-4"
              style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
            >
              <div className="mb-3 h-4 w-3/4 rounded" style={{ backgroundColor: "var(--app-divider)" }} />
              <div className="mb-4 h-3 w-1/2 rounded" style={{ backgroundColor: "var(--app-divider)" }} />
              <div className="h-3 w-1/3 rounded" style={{ backgroundColor: "var(--app-divider)" }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border py-20"
          style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
        >
          <svg className="mb-3 h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: "var(--app-text-secondary)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "var(--app-text-secondary)" }}>
            No {activeTab} templates found
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t._id} template={t} />
          ))}
        </div>
      )}
    </div>
  );
}
