export interface Template {
  _id: string;
  name: string;
  category: string;
  language: string;
  status: "approved" | "rejected";
  headerType: "none" | "text" | "image" | "video";
  headerContent: string;
  body: string;
  footer: string;
  buttonType: "none" | "call_to_action" | "quick_reply";
  buttonText: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTemplatesResponse {
  result: Template[];
}

export interface SaveTemplatePayload {
  name: string;
  category: string;
  language: string;
  headerType: string;
  headerContent: string;
  body: string;
  footer: string;
  buttonType: string;
  buttonText: string;
}
