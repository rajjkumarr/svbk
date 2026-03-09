"use client";

import { useState, useCallback, useEffect } from "react";
import { getApiErrorMessage } from "@/lib/api-client";
import type { StudentFeeRow } from "@/features/students/types";
import { getStudentsByBranch } from "@/features/students/services";
import { getAcademicYears } from "@/features/students/services/students.service";

export function useFetchStudents(branch: string, academicYear: string) {
  const [data, setData] = useState<StudentFeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getStudentsByBranch(branch, academicYear);
      setData(rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load students"));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [branch, academicYear]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { data, loading, error, refetch: fetchStudents };
}

export function useFetchAcademicYears() {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAcademicYears = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const years = await getAcademicYears();
      setAcademicYears(years);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load academic years"));
      setAcademicYears([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAcademicYears();
  }, []);
  return { academicYears, loading, error, refetch: fetchAcademicYears };

}


