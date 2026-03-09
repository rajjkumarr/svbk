/**
 * Students service – business logic. Calls API layer; maps response to domain types.
 */

import type { StudentFeeRow, TermFeeItem } from "@/features/students/types";
import type { GetStudentsDetailsResponse } from "@/features/students/types";
import { getAcademicYearsApi, getStudentsDetailsByBranchApi, getStudentByAdmissionApi } from "@/features/students/api/students.api";

/** Parse API termFee array: [ { "1st Term Fee": { amount, paymentStatus } }, ... ] */
function parseTermFees(termFee: unknown): Record<string, TermFeeItem> {
  const out: Record<string, TermFeeItem> = {};
  if (!Array.isArray(termFee)) return out;
  for (const entry of termFee) {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const key = Object.keys(entry)[0];
      const val = (entry as Record<string, unknown>)[key];
      if (key && val && typeof val === "object" && "amount" in val) {
        const v = val as { amount?: number; paidAmount?: number; penalityAmount?: number; penaltyAmount?: number; paymentStatus?: string };
        out[key] = {
          amount: typeof v.amount === "number" ? v.amount : 0,
          paidAmount: typeof v.paidAmount === "number" ? v.paidAmount : 0,
          penaltyAmount: typeof (v.penalityAmount ?? v.penaltyAmount) === "number" ? (v.penalityAmount ?? v.penaltyAmount ?? 0) : 0,
          paymentStatus: typeof v.paymentStatus === "string" ? v.paymentStatus : "Unpaid",
        };
      }
    }
  }
  return out;
}

/** Map API result item to table row (handles different backend key names) */
function mapApiResultToRow(item: Record<string, unknown>, index: number): StudentFeeRow {
  const id = String(item.id ?? item.studentId ?? index + 1);
  const name = String(item.name ?? item.studentName ?? item.student_name ?? "");
  const classVal = String(item.class ?? item.className ?? item.class_name ?? "");
  const section = String(item.section ?? item.sectionName ?? item.section_name ?? "");
  const rollNo = String(item.rollNo ?? item.roll_no ?? item.rollNumber ?? item.roll ?? "");
  const admissionNumber = String(item.admissionNumber ?? item.admissionNo ?? item.admission_number ?? "");
  const phone = String(item.phone ?? item.phoneNumber ?? item.mobile ?? "");
  const email = String(item.email ?? item.emailId ?? "");
  const amount = String(item.amount ?? item.feeAmount ?? "—");
  const status = (item.status === "Paid" || item.status === "Pending" ? item.status : "Pending") as "Paid" | "Pending";
  const termFees = parseTermFees(item.termFee ?? item.termFees ?? []);
  return { id, name, class: classVal, section, rollNo, admissionNumber, phone, email, amount, status, termFees };
}

export async function getStudentsByBranch(
  branch: string,
  academicYear: string
): Promise<StudentFeeRow[]> {
  const data = await getStudentsDetailsByBranchApi(branch, academicYear);
  const results = Array.isArray(data) ? data : (data as GetStudentsDetailsResponse).results ?? [];
  return Array.isArray(results)
    ? (results as Record<string, unknown>[]).map((item, i) => mapApiResultToRow(item, i))
    : [];
}

export async function getAcademicYears(): Promise<string[]> {
  const data = await getAcademicYearsApi();
  return data;
}

export async function getStudentByAdmission(
  admissionNumber: string,
  academicYear: string
): Promise<StudentFeeRow> {
  const data = await getStudentByAdmissionApi(admissionNumber, academicYear);
  const item = (data && typeof data === "object" && "result" in data)
    ? data.result as Record<string, unknown>
    : data;
  if (!item || (typeof item === "object" && Object.keys(item).length === 0)) {
    throw new Error("Student not found. Please check the admission number.");
  }
  return mapApiResultToRow(item as Record<string, unknown>, 0);
}
