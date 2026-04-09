/**
 * Tenants service – business logic. Calls API layer; maps response to domain types.
 */

import { getTenantsApi, getTenantByIdApi, saveTenantApi, type SaveTenantPayload } from "@/features/tenants/api/tenants.api";
import type { Tenant } from "@/features/tenants/tenantData";

export async function getTenantById(id: string): Promise<Tenant> {
  const data = await getTenantByIdApi(id);

  const raw = (data && typeof data === "object" && "data" in data)
    ? (data as { data: Tenant }).data
    : data;

  return {
    id: String(raw?.id ?? ""),
    schoolName: raw?.schoolName ?? "",
    schoolCode: raw?.schoolCode ?? "",
    tenantCode: raw?.tenantCode ?? "",
    tenantName: raw?.tenantName ?? "",
    address: raw?.address ?? "",
    city: raw?.city ?? "",
    state: raw?.state ?? "",
    country: raw?.country ?? "",
  };
}

export async function getTenants(): Promise<Tenant[]> {
  const data = await getTenantsApi();

  // Normalise response — backend may return { data: [...] } or the array directly
  const list = (data && typeof data === "object" && "data" in data)
    ? (data as { data: Tenant[] }).data
    : data;

  return Array.isArray(list) ? list : [];
}

export async function saveTenant(payload: SaveTenantPayload): Promise<Tenant> {
  const data = await saveTenantApi(payload);

  // Normalise response — backend may return { data: {...} } or the object directly
  const raw = (data && typeof data === "object" && "data" in data)
    ? (data as { data: Tenant }).data
    : data;

  return {
    id: String(raw?.id ?? raw?.id ?? ""),
    schoolName: raw?.schoolName ?? payload.schoolName,
    schoolCode: raw?.schoolCode ?? payload.schoolCode,
    tenantCode: raw?.tenantCode ?? payload.tenantCode,
    tenantName: raw?.tenantName ?? payload.tenantName,
    address: raw?.address ?? payload.address,
    city: raw?.city ?? payload.city,
    state: raw?.state ?? payload.state,
    country: raw?.country ?? payload.country,
  };
}
