import { get, post } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/services/constants/endpoints";
import type { GetTemplatesResponse, SaveTemplatePayload, Template } from "@/features/templates/types";

export async function getTemplatesApi(): Promise<GetTemplatesResponse | Template[]> {
  return get<GetTemplatesResponse | Template[]>(API_ENDPOINTS.templates.getTemplates);
}

export async function saveTemplateApi(payload: SaveTemplatePayload): Promise<Template> {
  return post<Template, SaveTemplatePayload>(API_ENDPOINTS.templates.saveTemplate, payload);
}
