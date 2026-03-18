/**
 * Students feature – API layer (backend endpoint calls only).
 * Uses global api-client from lib. No business logic here.
 */

import { get, post } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/services/constants/endpoints";
import type { GetStudentsDetailsResponse, StudentFeeRow, AcademicYearItem } from "@/features/students/types";

type UploadValidationRow = Record<string, string>;

export async function getStudentsDetailsByBranchApi(
  branch: string,
  academicYear: string
): Promise<GetStudentsDetailsResponse | StudentFeeRow[]> {
  const url = `${API_ENDPOINTS.studentsDetails.getStudentsDetailsByBranch}?branch=${encodeURIComponent(branch)}&academicYear=${encodeURIComponent(academicYear)}`;
  return get<GetStudentsDetailsResponse | StudentFeeRow[]>(url);
}

export async function 
getAcademicYearsApi(): Promise<AcademicYearItem[]> {
  const url = `${API_ENDPOINTS.studentsDetails.getAcademicYears}`;
  return get<AcademicYearItem[]>(url);
}

export async function addPenaltyApi(academicYear: string, branch: string, term: string, amount: number): Promise<void> {
  const url = `${API_ENDPOINTS.studentsDetails.addPenalty}`;
  return post<void>(url, { academicYear, branch, term, penalityAmount:String(amount) });
}

export async function getStudentByAdmissionApi(
  admissionNumber: string,
  academicYear: string
): Promise<Record<string, unknown>> {
  const url = `${API_ENDPOINTS.studentsDetails.getStudentByAdmission}?admission=${encodeURIComponent(admissionNumber)}&academicYear=${encodeURIComponent(academicYear)}`;
  return get<Record<string, unknown>>(url);
}

export async function createOrderApi(amount: number,admission: string,academicYear: string,receipt: string,currency: string): Promise<void> {
  const url = `${API_ENDPOINTS.studentsDetails.createOrder}`;
  return post<void>(url, { amount,ADMISSION:admission,academicYear,receipt,currency });
}

export async function checkTermDetailsApi(payload: { tableData: UploadValidationRow[]; branch: string }): Promise<UploadValidationRow[]> {
  const url = `${API_ENDPOINTS.studentsDetails.checkTermDetails}`;
  return post<UploadValidationRow[]>(url, payload);
}