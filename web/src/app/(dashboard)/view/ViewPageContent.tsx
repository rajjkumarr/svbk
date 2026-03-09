"use client";

import { useState, useMemo, useRef, useEffect, Fragment } from "react";
import {
  ActionBar,
  DataTableCard,
  SummaryCards,
  TablePagination,
  type SummaryCardItem,
  type PaginationInfo,
} from "@/components/dashboard";
import { IconActions, StatusBadge } from "@/components/common";
import { PageHeader } from "@/components/layout";
import { useFetchAcademicYears, useFetchStudents } from "@/features/students/hooks/useFetchStudents";
import { downloadStudentsAsExcel } from "@/features/students/utils/exportStudentsToExcel";
import { Modal } from "@/components/common";
import { EditStudentForm } from "@/features/students/components/EditStudentForm";
import { ReceiptDropdown } from "@/features/students/components/ReceiptDropdown";
import { StudentsShimmer } from "@/features/students/components/StudentsShimmer";
import type { StudentFeeRow } from "@/features/students/types";

const PAGE_SIZE = 5;
const BRANCH = "hyd";

function formatCurrency(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Compute summary from rows: paid = term fees with Paid status, pending = Unpaid, total = paid + pending */
function computeSummaryItems(rows: { termFees?: Record<string, { amount: number; paymentStatus: string }> }[]): SummaryCardItem[] {
  let paid = 0;
  let pending = 0;
  console.log(rows,"rows")
  rows.forEach((r) => {
    if (!r.termFees) return;
    Object.values(r.termFees).forEach((t) => {
      const amt = t.amount ?? 0;
      if (t.paymentStatus === "Paid") paid += amt;
      else pending += amt; // Unpaid, Pending, or any other
    });
  });
  const totalCollection = paid + pending;
  return [
    { label: "Total Students", value: rows.length.toLocaleString("en-IN") },
    { label: "Paid Fees", value: formatCurrency(paid) },
    { label: "Pending Fees", value: formatCurrency(pending) },
    { label: "Total Collection", value: formatCurrency(totalCollection) },
  ];
}

const FIXED_HEADERS = [
  "", // checkbox column
  "Student Name",
  "Class",
  "Section",
  "Roll No",
  "Admission Number",
  "Phone Number",
  "Email",
] as const;

const TAIL_HEADERS = ["Actions"] as const;

/* ─── Sorting helpers ─── */
type SortDir = "asc" | "desc" | null;
type SortType = "string" | "number" | "status";

type SortConfig = {
  getValue: (r: StudentFeeRow) => string | number;
  type: SortType;
};

/** Build sort config for every sortable header */
function buildSortConfigs(termHeaders: string[]): Record<string, SortConfig> {
  const map: Record<string, SortConfig> = {
    "Student Name":     { getValue: (r) => r.name, type: "string" },
    "Class":            { getValue: (r) => r.class, type: "string" },
    "Section":          { getValue: (r) => r.section, type: "string" },
    "Roll No":          { getValue: (r) => r.rollNo, type: "number" },
    "Admission Number": { getValue: (r) => r.admissionNumber, type: "string" },
    "Phone Number":     { getValue: (r) => r.phone, type: "string" },
    "Email":            { getValue: (r) => r.email, type: "string" },
  };
  termHeaders.forEach((t) => {
    map[t] = { getValue: (r) => r.termFees?.[t]?.amount ?? 0, type: "number" };
    const statusKey = t.replace(/\s*Fee\s*$/i, " Status");
    map[statusKey] = { getValue: (r) => r.termFees?.[t]?.paymentStatus ?? "", type: "status" };
  });
  return map;
}

function compareFn(a: string | number, b: string | number, type: SortType, dir: "asc" | "desc"): number {
  const mul = dir === "asc" ? 1 : -1;
  if (type === "number") {
    const nA = typeof a === "number" ? a : parseFloat(String(a)) || 0;
    const nB = typeof b === "number" ? b : parseFloat(String(b)) || 0;
    return (nA - nB) * mul;
  }
  return String(a).localeCompare(String(b), "en", { sensitivity: "base" }) * mul;
}

function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <span className="ml-1 inline-flex flex-col leading-none" style={{ fontSize: 8, lineHeight: "8px" }}>
      <span style={{ color: dir === "asc" ? "var(--app-text-primary)" : "var(--app-text-secondary)", opacity: dir === "asc" ? 1 : 0.35 }}>▲</span>
      <span style={{ color: dir === "desc" ? "var(--app-text-primary)" : "var(--app-text-secondary)", opacity: dir === "desc" ? 1 : 0.35 }}>▼</span>
    </span>
  );
}

/** Extract unique term names from all rows and sort (1st, 2nd, 3rd...) */
function getTermHeaders(rows: { termFees?: Record<string, { amount: number; paymentStatus: string }> }[]): string[] {
  const set = new Set<string>();
  rows.forEach((r) => {
    if (r.termFees) Object.keys(r.termFees).forEach((k) => set.add(k));
  });
  return Array.from(set).sort((a, b) => {
    const nA = parseInt(a, 10) || 0;
    const nB = parseInt(b, 10) || 0;
    if (nA !== nB) return nA - nB;
    return a.localeCompare(b);
  });
}

/** e.g. "1st Term Fee" -> "1st Term Status" */
function termStatusHeader(termName: string): string {
  return termName.replace(/\s*Fee\s*$/i, " Status");
}

/** Re-export for consumers that import from this file */

function EditIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export function ViewPageContent() {
  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editStudent, setEditStudent] = useState<StudentFeeRow | null>(null);
  const [penaltyOpen, setPenaltyOpen] = useState(false);
  const [penaltyTerm, setPenaltyTerm] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const { data: rows, loading, error } = useFetchStudents(BRANCH, academicYear);
  const { academicYears } = useFetchAcademicYears();

  const termHeaders = useMemo(() => getTermHeaders(rows), [rows]);
  const sortConfigs = useMemo(() => buildSortConfigs(termHeaders), [termHeaders]);

  const toggleSort = (header: string) => {
    if (!sortConfigs[header]) return;
    if (sortKey === header) {
      setSortDir((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(header);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.admissionNumber.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.email.toLowerCase().includes(q)
      );
    }
    if (sortKey && sortDir && sortConfigs[sortKey]) {
      const cfg = sortConfigs[sortKey];
      result = [...result].sort((a, b) => compareFn(cfg.getValue(a), cfg.getValue(b), cfg.type, sortDir));
    }
    return result;
  }, [rows, search, sortKey, sortDir, sortConfigs]);

  const summaryItems = useMemo(() => computeSummaryItems(rows), [rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageIndex = Math.min(currentPage, totalPages);
  const start = (pageIndex - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const paginationInfo: PaginationInfo = {
    from: filtered.length === 0 ? 0 : start + 1,
    to: Math.min(start + PAGE_SIZE, filtered.length),
    total: filtered.length,
    label: "students",
  };

  const pageIds = pageRows.map((r) => r.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.has(id));
  const allOnPageSelected = pageRows.length > 0 && selectedOnPage.length === pageRows.length;
  const someOnPageSelected = selectedOnPage.length > 0;

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.checked = allOnPageSelected;
    el.indeterminate = someOnPageSelected && !allOnPageSelected;
  }, [allOnPageSelected, someOnPageSelected]);

  const handleExportExcel = () => {
    const toExport =
      selectedIds.size > 0
        ? filtered.filter((r) => selectedIds.has(r.id))
        : filtered;
    if (toExport.length === 0) return;
    const name = `students-fee-${academicYear}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    downloadStudentsAsExcel(toExport, name);
  };

  /** For each term: "1st Term Fee" (amount) then "1st Term Status" (status) */
  const tableHeaders = useMemo(
    () => [
      ...FIXED_HEADERS.slice(1),
      ...termHeaders.flatMap((t) => [t, termStatusHeader(t)]),
      ...TAIL_HEADERS,
    ],
    [termHeaders]
  );
  const totalColSpan = 1 + tableHeaders.length;

  if (loading) return <StudentsShimmer />;

  return (
    <div className="space-y-2">
      <PageHeader
        title="Student Fee Management"
        subtitle="View and manage student fee records and collections"
      />
      <SummaryCards items={summaryItems} />
      <ActionBar
        primaryLabel="Add Penalty"
        onPrimary={() => { setPenaltyTerm(""); setPenaltyAmount(""); setPenaltyOpen(true); }}
        secondaryLabel="Export Excel"
        onSecondary={handleExportExcel}
        searchPlaceholder="Search students..."
        searchValue={search}
        onSearchChange={setSearch}
        onFiltersClick={() => {}}
        filterOptions={
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="h-11 rounded-xl border bg-[var(--app-card-bg)] px-4 text-base outline-none transition-colors focus:ring-2 focus:ring-[var(--app-search-focus)]/20"
            style={{ borderColor: "var(--app-search-border)", color: "var(--app-text-primary)" }}
          >
            {academicYears.map((year: any) => (
              <option key={year._id} value={year.academicYear}>{year.academicYear}</option>
            ))}
          </select>
        }
      />
      <DataTableCard
        title="Student Fee List"
        pagination={
          <TablePagination
            info={paginationInfo}
            currentPage={pageIndex}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        }
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-[var(--app-search-bg)]" style={{ borderColor: "var(--app-divider)" }}>
              <th className="w-10 px-4 py-4">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  aria-label="Select all on page"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              {tableHeaders.map((header) => {
                const sortable = !!sortConfigs[header];
                return (
                  <th
                    key={header}
                    className={`px-6 py-4 font-semibold uppercase tracking-wider ${sortable ? "cursor-pointer select-none" : ""}`}
                    style={{ color: "var(--app-text-secondary)" }}
                    onClick={sortable ? () => toggleSort(header) : undefined}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {header}
                      {sortKey === header && sortDir && <SortIcon dir={sortDir} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr style={{ borderColor: "var(--app-divider)" }}>
                <td colSpan={totalColSpan} className="px-6 py-12 text-center text-sm" style={{ color: "var(--app-danger)" }}>
                  {error}
                </td>
              </tr>
            )}
            {!error && pageRows.map((row) => (
              <tr
                key={row.id}
                className="border-b cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--app-table-row-hover)] last:border-b-0"
                style={{ borderColor: "var(--app-divider)" }}
              >
                <td className="w-10 px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    aria-label={`Select ${row.name || row.id}`}
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium text-white bg-app-brand"
                    >
                      {row.name ? row.name.split(" ").map((n) => n[0]).join("") : "—"}
                    </div> */}
                    <span className="font-medium" style={{ color: "var(--app-text-primary)" }}>{row.name || "—"}</span>
                  </div>
                </td>
                <td className="px-6 py-4" style={{ color: "var(--app-text-secondary)" }}>{row.class || "—"}</td>
                <td className="px-6 py-4" style={{ color: "var(--app-text-secondary)" }}>{row.section || "—"}</td>
                <td className="px-6 py-4" style={{ color: "var(--app-text-secondary)" }}>{row.rollNo || "—"}</td>
                <td className="px-6 py-4" style={{ color: "var(--app-text-secondary)" }}>{row.admissionNumber || "—"}</td>
                <td className="px-6 py-4" style={{ color: "var(--app-text-secondary)" }}>{row.phone || "—"}</td>
                <td className="px-6 py-4" style={{ color: "var(--app-text-secondary)" }}>{row.email || "—"}</td>
                {termHeaders.map((termName) => {
                  const term = row.termFees?.[termName];
                  return (
                    <Fragment key={termName}>
                      <td className="px-6 py-4" style={{ color: "var(--app-text-primary)" }}>
                        {term?.amount != null ? `₹${Number(term.amount).toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {term ? (
                          <StatusBadge variant={term.paymentStatus === "Paid" ? "success" : "warning"}>
                            {term.paymentStatus || "—"}
                          </StatusBadge>
                        ) : (
                          "—"
                        )}
                      </td>
                    </Fragment>
                  );
                })}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <ReceiptDropdown student={row} />
                    <IconActions
                      actions={[
                        { label: "Edit", onClick: () => setEditStudent(row), icon: <EditIcon /> },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTableCard>

      <Modal
        open={editStudent !== null}
        onClose={() => setEditStudent(null)}
        title="Edit Student"
        size="2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditStudent(null)}
              className="h-10 rounded-lg border px-5 text-sm font-medium transition-colors hover:bg-[var(--app-nav-hover-bg)]"
              style={{ borderColor: "var(--app-search-border)", color: "var(--app-text-primary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-student-form"
              className="h-10 rounded-lg px-5 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--app-brand)" }}
            >
              Save Changes
            </button>
          </>
        }
      >
        {editStudent && (
          <EditStudentForm
            student={editStudent}
            formId="edit-student-form"
            onSubmit={(updated) => {
              console.log("Save student:", updated);
              setEditStudent(null);
            }}
          />
        )}
      </Modal>

      {/* Add Penalty Modal */}
      <Modal
        open={penaltyOpen}
        onClose={() => setPenaltyOpen(false)}
        title="Add Penalty"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setPenaltyOpen(false)}
              className="h-10 rounded-lg border px-5 text-sm font-medium transition-colors hover:bg-[var(--app-nav-hover-bg)]"
              style={{ borderColor: "var(--app-search-border)", color: "var(--app-text-primary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-penalty-form"
              className="h-10 rounded-lg px-5 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--app-brand)" }}
            >
              Add Penalty
            </button>
          </>
        }
      >
        <form
          id="add-penalty-form"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Add penalty:", { term: penaltyTerm, amount: penaltyAmount });
            setPenaltyOpen(false);
          }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--app-text-secondary)" }}>
              Term
            </label>
            <select
              value={penaltyTerm}
              onChange={(e) => setPenaltyTerm(e.target.value)}
              required
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--app-search-focus)]/20"
              style={{ borderColor: "var(--app-search-border)", backgroundColor: "var(--app-card-bg)", color: "var(--app-text-primary)" }}
            >
              <option value="" disabled>Select term</option>
              {termHeaders.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--app-text-secondary)" }}>
              Penalty Amount
            </label>
            <input
              type="number"
              min="1"
              value={penaltyAmount}
              onChange={(e) => setPenaltyAmount(e.target.value)}
              required
              placeholder="Enter amount"
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--app-search-focus)]/20"
              style={{ borderColor: "var(--app-search-border)", backgroundColor: "var(--app-card-bg)", color: "var(--app-text-primary)" }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
