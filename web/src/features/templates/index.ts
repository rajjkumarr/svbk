export type { Template, SaveTemplatePayload, GetTemplatesResponse } from "./types";
export { getTemplates, getApprovedTemplates, saveTemplate } from "./services/templates.service";
export { useFetchTemplates, useFetchApprovedTemplates } from "./hooks/useFetchTemplates";
