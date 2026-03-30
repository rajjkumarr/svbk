import { get, post } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/services/constants/endpoints";
import type { GetTemplatesResponse, SaveTemplatePayload, Template } from "@/features/templates/types";

export async function getTemplatesApi(branch:any): Promise<GetTemplatesResponse | Template[]> {
 const url =`${API_ENDPOINTS.templates.getTemplates}?branch=${branch}`
  return get<GetTemplatesResponse | Template[]>(url);
}

export async function saveTemplateApi(payload: SaveTemplatePayload): Promise<Template> {
  return post<Template, SaveTemplatePayload>(API_ENDPOINTS.templates.saveTemplate, payload);
}
