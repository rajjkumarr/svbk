import { getTemplatesApi, saveTemplateApi } from "@/features/templates/api/templates.api";
import type { Template, SaveTemplatePayload } from "@/features/templates/types";

function normalizeResponse(raw: unknown): Template[] {
  if (Array.isArray(raw)) return raw as Template[];
  if (raw && typeof raw === "object" && "result" in raw && Array.isArray((raw as { result: unknown }).result)) {
    return (raw as { result: Template[] }).result;
  }
  return [];
}

export async function getTemplates(branch:any): Promise<Template[]> {
  const raw = await getTemplatesApi(branch);
  return normalizeResponse(raw);
}

export async function getApprovedTemplates(): Promise<Template[]> {
  const all = await getTemplates({branch:"hyd"});
  return all.filter((t) => t.status === "approved");
}

export async function saveTemplate(payload: SaveTemplatePayload): Promise<Template> {
  return saveTemplateApi(payload);
}
