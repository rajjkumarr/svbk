/**
 * API endpoints by feature. Add new features (auth, user, …) here.
 */

// import { notification } from "@/features/notifications/service/notification.service";

export const 
API_ENDPOINTS = {
  auth: {
    verifyLogin: "/verifyLogin",
    logout: "/logout",
    refreshToken: "/refresh",
  },
  user: {
    profile: "/user/profile",
    update: "/user/update",
  },
  studentsDetails: {
    getStudentsDetailsByBranch: "/studentsDetails/getStudentsDetailsByBranch",
    getAcademicYears: "/studentsDetails/getAcademicYears",
    getStudentByAdmission: "/studentsDetails/getStudentDetailsByAdmission",
    addPenalty: "/studentsDetails/addPenality",
    createOrder: "/studentsDetails/create/order",
    checkTermDetails: "/studentsDetails/checkTermDetails",
    getAdminNotifications:"/studentsDetails/getAdminNotifications"
  },
  templates: {
    getTemplates: "/studentsDetails/getTemplateDetails",
    saveTemplate: "/templates/saveTemplate",
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
