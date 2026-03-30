"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api-client";
import type { StudentFeeRow, AcademicYearItem } from "@/features/students/types";
import { getStudentByAdmission, getAcademicYears } from "@/features/students/services/students.service";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function filterCurrentAndPastYear(allYears: AcademicYearItem[]): AcademicYearItem[] {
  const currentYearObj = allYears.find((y) => y.isCurrentYear);
  if (!currentYearObj) return allYears;

  const startYear = parseInt(currentYearObj.academicYear.split("-")[0], 10);
  const prevYearStr = `${startYear - 1}-${startYear}`;
  const prevYearObj = allYears.find((y) => y.academicYear === prevYearStr);

  const filtered: AcademicYearItem[] = [currentYearObj];
  if (prevYearObj) filtered.push(prevYearObj);
  return filtered;
}

export function PayNowPageContent() {
  const router = useRouter();

  const [admissionNo, setAdmissionNo] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [allYears, setAllYears] = useState<AcademicYearItem[]>([]);
  const [yearsLoading, setYearsLoading] = useState(true);

  const [student, setStudent] = useState<StudentFeeRow | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const academicYears = useMemo(() => filterCurrentAndPastYear(allYears), [allYears]);

  useEffect(() => {
    (async () => {
      try {
        const years = await getAcademicYears();
        setAllYears(years);
        const currentYear = years.find((y) => y.isCurrentYear);
        if (currentYear) setAcademicYear(currentYear.academicYear);
        else if (years.length > 0) setAcademicYear(years[0].academicYear);
      } catch {
        /* silently ignore */
      } finally {
        setYearsLoading(false);
      }
    })();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!admissionNo.trim() || !academicYear) return;
    setSearching(true);
    setError(null);
    setStudent(null);
    try {
      const row = await getStudentByAdmission(admissionNo.trim(), academicYear);
      setStudent(row);
    } catch (err) {
      setError(getApiErrorMessage(err, "Student not found. Please check the admission number."));
    } finally {
      setSearching(false);
    }
  }, [admissionNo, academicYear]);

  const termEntries = student
    ? Object.entries(student.termFees)
    : [];

  const handlePayNow = (termName: string) => {
    if (!student) return;
    const params = new URLSearchParams({
      admissionNumber: student.admissionNumber,
      academicYear,
      term: termName,
    });
    router.push(`/pay-now/payment?${params.toString()}`);
  };

  const inputCls =
    "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--app-brand)]/20";

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold" style={{ color: "var(--app-text-primary)" }}>
        Pay Now
      </h1>

      {/* Search card */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
      >
        <p className="mb-4 text-sm font-medium" style={{ color: "var(--app-text-secondary)" }}>
          Search student by admission number
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Admission Number
            </label>
            <input
              className={inputCls}
              style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
              placeholder="e.g. Dummy1"
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="w-full space-y-1.5 sm:w-56">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Academic Year
            </label>
            <select
              className={inputCls}
              style={{ backgroundColor: "var(--app-search-bg)", borderColor: "var(--app-divider)", color: "var(--app-text-primary)" }}
              value={academicYear}
              onChange={(e) =>setAcademicYear(e.target.value)}
              disabled={yearsLoading}
            >
              {yearsLoading ? (
                <option>Loading...</option>
              ) : academicYears.length === 0 ? (
                <option>No years available</option>
              ) : (
                academicYears.map((y) => (
                  <option key={y._id} value={y.academicYear}>{y.academicYear}</option>
                ))
              )}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={!admissionNo.trim() || !academicYear || searching}
            className="inline-flex h-[42px] items-center gap-2 rounded-xl px-6 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "var(--app-brand)" }}
          >
            {searching ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {student && (
        <div className="space-y-5">
          {/* Student info */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "var(--app-brand)" }}
              >
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold" style={{ color: "var(--app-text-primary)" }}>
                  {student.name}
                </p>
                <p className="text-xs" style={{ color: "var(--app-text-secondary)" }}>
                  {student.admissionNumber}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              {[
                { label: "Class", value: student.class },
                { label: "Section", value: student.section },
                { label: "Roll No", value: student.rollNo },
                { label: "Phone", value: student.phone },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: "var(--app-text-primary)" }}>{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Term fees table */}
          <div
            className="overflow-hidden rounded-xl border"
            style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "var(--app-search-bg)" }}>
                  {["Term", "Fee Amount",  "Total", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--app-text-secondary)", borderBottom: "1px solid var(--app-divider)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {termEntries.map(([termName, fee]) => {
                  const total = fee.amount;
                  const isPaid = fee.paymentStatus === "Paid";
                  return (
                    <tr
                      key={termName}
                      className="transition-colors hover:bg-[var(--app-table-row-hover)]"
                      style={{ borderBottom: "1px solid var(--app-divider)" }}
                    >
                      <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "var(--app-text-primary)" }}>
                        {termName}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "var(--app-text-primary)" }}>
                        {formatCurrency(fee.amount)}
                      </td>
                      {/* <td className="px-5 py-3.5 text-sm" style={{ color: fee.penaltyAmount > 0 ? "var(--app-danger)" : "var(--app-text-secondary)" }}>
                        {formatCurrency(fee.penaltyAmount)}
                      </td> */}
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: "var(--app-text-primary)" }}>
                        {formatCurrency(total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: isPaid ? "var(--app-success-bg)" : "var(--app-warning-bg)",
                            color: isPaid ? "var(--app-success)" : "var(--app-warning)",
                          }}
                        >
                          {fee.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {isPaid ? (
                          <span className="text-xs" style={{ color: "var(--app-text-secondary)" }}>Paid</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePayNow(termName)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                            style={{ backgroundColor: "var(--app-brand)" }}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {termEntries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: "var(--app-text-secondary)" }}>
                      No term fees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
