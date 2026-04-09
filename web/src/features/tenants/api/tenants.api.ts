/**
 * Tenants feature – API layer (backend endpoint calls only).
 * Uses global api-client from lib. No business logic here.
 */

import { get, post } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/services/constants/endpoints";
import type { Tenant } from "@/features/tenants/tenantData";

export type SaveTenantPayload = Omit<Tenant, "id">;

export async function getTenantsApi(): Promise<Tenant[]> {
  return get<Tenant[]>(API_ENDPOINTS.tenants.getTenants);
}

export async function getTenantByIdApi(id: string): Promise<Tenant> {
  return get<Tenant>(`${API_ENDPOINTS.tenants.getTenantById}/${id}`);
}

export async function saveTenantApi(payload: SaveTenantPayload): Promise<Tenant> {
  return post<Tenant>(API_ENDPOINTS.tenants.saveTenant, payload);
}
