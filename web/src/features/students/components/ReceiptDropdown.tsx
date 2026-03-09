"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { StudentFeeRow } from "@/features/students/types";

function ReceiptIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  );
}

export interface ReceiptDropdownProps {
  student: StudentFeeRow;
}

export function ReceiptDropdown({ student }: ReceiptDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const paidTerms = Object.entries(student.termFees).filter(
    ([, t]) => t.paymentStatus === "Paid"
  );
  const disabled = paidTerms.length === 0;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (termName: string) => {
    setIsOpen(false);
    const params = new URLSearchParams({
      studentId: student.id,
      term: termName,
    });
    router.push(`/view/receipt?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (paidTerms.length === 1) {
            handleSelect(paidTerms[0][0]);
          } else {
            setIsOpen((prev) => !prev);
          }
        }}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-[background-color,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--app-nav-hover-bg)] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: disabled ? "var(--app-text-secondary)" : "var(--app-brand)" }}
        title={disabled ? "No paid terms" : "View receipt"}
        aria-label="View receipt"
      >
        <ReceiptIcon />
      </button>

      {isOpen && paidTerms.length > 1 && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] animate-[modal-in_0.15s_ease-out] rounded-lg border py-1 shadow-lg"
          style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
        >
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
            Select Term
          </p>
          {paidTerms.map(([termName]) => (
            <button
              key={termName}
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelect(termName); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--app-nav-hover-bg)]"
              style={{ color: "var(--app-text-primary)" }}
            >
              <ReceiptIcon className="h-4 w-4 flex-shrink-0" />
              {termName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
