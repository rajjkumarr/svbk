"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/common/RichTextEditor";

const CATEGORIES = ["Utility", "Marketing", "Authentication", "Transactional"];
const LANGUAGES = ["English", "Hindi", "Telugu", "Tamil", "Kannada"];

type FormState = {
  name: string;
  category: string;
  language: string;
  headerType: "none" | "text" | "image" | "video";
  headerContent: string;
  body: string;
  footer: string;
  buttonType: "none" | "call_to_action" | "quick_reply";
  buttonText: string;
};

const INITIAL: FormState = {
  name: "",
  category: "",
  language: "",
  headerType: "none",
  headerContent: "",
  body: "",
  footer: "",
  buttonType: "none",
  buttonText: "",
};

function PhonePreview({ form }: { form: FormState }) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
        Preview
      </p>
      <div
        className="relative w-[280px] rounded-[2rem] border-[3px] p-2"
        style={{ borderColor: "var(--app-divider)", backgroundColor: "var(--app-search-bg)" }}
      >
        {/* Notch */}
        <div className="mx-auto mb-2 h-5 w-20 rounded-full" style={{ backgroundColor: "var(--app-divider)" }} />

        {/* Chat area */}
        <div className="min-h-[360px] rounded-2xl p-3" style={{ backgroundColor: "#e5ddd5" }}>
          {/* Message bubble */}
          <div className="max-w-[220px] rounded-xl rounded-tl-sm bg-white p-3 shadow-sm">
            {form.headerType === "text" && form.headerContent && (
              <p className="mb-1 text-xs font-bold text-zinc-800">{form.headerContent}</p>
            )}
            {form.headerType === "image" && (
              <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-zinc-200">
                <svg className="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
              </div>
            )}
            {form.headerType === "video" && (
              <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-zinc-200">
                <svg className="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
            )}
            {form.body && form.body !== "<p><br></p>" ? (
              <div
                className="prose-preview whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-700 [&_p]:m-0 [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold [&_h3]:text-[11px] [&_h3]:font-bold [&_ul]:ml-3 [&_ul]:list-disc [&_ol]:ml-3 [&_ol]:list-decimal [&_a]:text-blue-600 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: form.body }}
              />
            ) : (
              <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-700">
                Your message body will appear here...
              </p>
            )}
            {form.footer && (
              <p className="mt-2 text-[10px] text-zinc-400">{form.footer}</p>
            )}
            <p className="mt-1 text-right text-[9px] text-zinc-400">12:00 PM</p>
          </div>

          {form.buttonType !== "none" && form.buttonText && (
            <div className="mt-1 max-w-[220px]">
              <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                <span className="text-[11px] font-medium" style={{ color: "var(--app-brand)" }}>
                  {form.buttonText}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-2 flex items-center gap-2 px-1">
          <div className="h-8 flex-1 rounded-full" style={{ backgroundColor: "var(--app-divider)" }} />
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: "var(--app-divider)" }} />
        </div>
      </div>
    </div>
  );
}

export function SaveTemplatePageContent() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const bodyPlainText = form.body.replace(/<[^>]*>/g, "").trim();
  const canSubmit = form.name.trim() && form.category && form.language && bodyPlainText;

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    // TODO: call API
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    router.push("/templates");
  };

  const inputCls =
    "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--app-brand)]/20";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/templates")}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[var(--app-nav-hover-bg)]"
          style={{ color: "var(--app-text-secondary)" }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--app-text-primary)" }}>
          Create Template
        </h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Form */}
        <div
          className="flex-1 space-y-5 rounded-xl border p-6"
          style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
        >
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls}
              style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
              placeholder="e.g. Fee Reminder"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          {/* Category + Language */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={inputCls}
                style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
                Language <span className="text-red-500">*</span>
              </label>
              <select
                className={inputCls}
                style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
                value={form.language}
                onChange={(e) => set("language", e.target.value)}
              >
                <option value="">Select language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Header
            </label>
            <div className="flex gap-2">
              {(["none", "text", "image", "video"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { set("headerType", t); set("headerContent", ""); }}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                  style={
                    form.headerType === t
                      ? { backgroundColor: "var(--app-brand)", color: "#fff", borderColor: "var(--app-brand)" }
                      : { borderColor: "var(--app-divider)", color: "var(--app-text-secondary)" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
            {form.headerType === "text" && (
              <input
                className={inputCls}
                style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
                placeholder="Header text"
                value={form.headerContent}
                onChange={(e) => set("headerContent", e.target.value)}
              />
            )}
            {(form.headerType === "image" || form.headerType === "video") && (
              <div
                className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed text-xs"
                style={{ borderColor: "var(--app-divider)", color: "var(--app-text-secondary)" }}
              >
                Upload {form.headerType} (coming soon)
              </div>
            )}
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Body <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={form.body}
              onChange={(val) => set("body", val)}
              placeholder="Enter message body. Use {{1}}, {{2}} for variables."
            />
            <p className="text-[11px]" style={{ color: "var(--app-text-secondary)" }}>
              {form.body.replace(/<[^>]*>/g, "").length} / 1024 characters
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Footer
            </label>
            <input
              className={inputCls}
              style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
              placeholder="e.g. Reply STOP to unsubscribe"
              value={form.footer}
              onChange={(e) => set("footer", e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Button
            </label>
            <div className="flex gap-2">
              {([
                { id: "none", label: "None" },
                { id: "call_to_action", label: "Call to Action" },
                { id: "quick_reply", label: "Quick Reply" },
              ] as const).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { set("buttonType", id); set("buttonText", ""); }}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                  style={
                    form.buttonType === id
                      ? { backgroundColor: "var(--app-brand)", color: "#fff", borderColor: "var(--app-brand)" }
                      : { borderColor: "var(--app-divider)", color: "var(--app-text-secondary)" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            {form.buttonType !== "none" && (
              <input
                className={inputCls}
                style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
                placeholder="Button label"
                value={form.buttonText}
                onChange={(e) => set("buttonText", e.target.value)}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSubmit || saving}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-6 text-sm font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: "var(--app-brand)" }}
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Template"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/templates")}
              className="h-10 rounded-xl border px-6 text-sm font-medium transition-colors hover:bg-[var(--app-nav-hover-bg)]"
              style={{ borderColor: "var(--app-divider)", color: "var(--app-text-secondary)" }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="w-full lg:w-[340px]">
          <div
            className="sticky top-6 rounded-xl border p-5"
            style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
          >
            <PhonePreview form={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
