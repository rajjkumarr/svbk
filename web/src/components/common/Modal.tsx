"use client";

import { useEffect, useRef, type ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Max-width class, defaults to max-w-lg */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  footer?: ReactNode;
}

const sizeMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-4xl",
};

export function Modal({ open, onClose, title, children, size = "lg", footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleClose = () => onClose();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-0 h-full w-full bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`flex w-full max-h-[90vh] flex-col ${sizeMap[size] ?? sizeMap.lg} animate-[modal-in_0.2s_ease-out] rounded-2xl border shadow-xl`}
          style={{
            backgroundColor: "var(--app-card-bg)",
            borderColor: "var(--app-divider)",
          }}
        >
          {/* Header */}
          {title && (
            <div
              className="flex flex-shrink-0 items-center justify-between border-b px-6 py-4"
              style={{ borderColor: "var(--app-divider)" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "var(--app-text-primary)" }}>
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--app-nav-hover-bg)]"
                style={{ color: "var(--app-text-secondary)" }}
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Body – scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

          {/* Footer – stays fixed at bottom */}
          {footer && (
            <div
              className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-6 py-4"
              style={{ borderColor: "var(--app-divider)" }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
