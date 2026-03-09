"use client";

import { useState, useCallback, useEffect } from "react";
import { getApiErrorMessage } from "@/lib/api-client";
import type { Template } from "@/features/templates/types";
import { getTemplates, getApprovedTemplates } from "@/features/templates/services/templates.service";

export function useFetchTemplates() {
  const [data, setData] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getTemplates();
      setData(rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load templates"));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useFetchApprovedTemplates() {
  const [data, setData] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getApprovedTemplates();
      setData(rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load templates"));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
