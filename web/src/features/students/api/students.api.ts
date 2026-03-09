/**
 * Students feature – API layer (backend endpoint calls only).
 * Uses global api-client from lib. No business logic here.
 */

import { get } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/services/constants/endpoints";
import type { GetStudentsDetailsResponse, StudentFeeRow } from "@/features/students/types";

export async function getStudentsDetailsByBranchApi(
  branch: string,
  academicYear: string
): Promise<GetStudentsDetailsResponse | StudentFeeRow[]> {
  const url = `${API_ENDPOINTS.studentsDetails.getStudentsDetailsByBranch}?branch=${encodeURIComponent(branch)}&academicYear=${encodeURIComponent(academicYear)}`;
  return get<GetStudentsDetailsResponse | StudentFeeRow[]>(url);
}

export async function getAcademicYearsApi(): Promise<string[]> {
  const url = `${API_ENDPOINTS.studentsDetails.getAcademicYears}`;
  return get<string[]>(url);
}

export async function getStudentByAdmissionApi(
  admissionNumber: string,
  academicYear: string
): Promise<Record<string, unknown>> {
  const url = `${API_ENDPOINTS.studentsDetails.getStudentByAdmission}?admission=${encodeURIComponent(admissionNumber)}&academicYear=${encodeURIComponent(academicYear)}`;
  return get<Record<string, unknown>>(url);
}