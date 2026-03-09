import * as XLSX from "xlsx";
import type { StudentFeeRow } from "@/features/students/types";

function getTermHeaders(rows: StudentFeeRow[]): string[] {
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

export function downloadStudentsAsExcel(rows: StudentFeeRow[], filename = "students-export.xlsx"): void {
  const termHeaders = getTermHeaders(rows);
  const headers = [
    "Student Name",
    "Class",
    "Section",
    "Roll No",
    "Admission Number",
    "Phone",
    "Email",
    ...termHeaders.flatMap((t) => [t, termStatusHeader(t)]),
  ];

  function rowToExcelRow(row: StudentFeeRow): string[] {
    const base = [
      row.name || "—",
      row.class || "—",
      row.section || "—",
      row.rollNo || "—",
      row.admissionNumber || "—",
      row.phone || "—",
      row.email || "—",
    ];
    const termCells = termHeaders.flatMap((termName) => {
      const t = row.termFees?.[termName];
      const amt = t?.amount != null ? `₹${Number(t.amount).toLocaleString("en-IN")}` : "—";
      const status = t?.paymentStatus ?? "—";
      return [amt, status];
    });
    return [...base, ...termCells];
  }

  const data = [headers, ...rows.map(rowToExcelRow)];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  XLSX.writeFile(wb, filename);
}
