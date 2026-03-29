import apiClient from "./apiClient";

// Generate email
export const generateEmail = (payload) =>
  apiClient.post("/api/tools/email", payload);

// Get PDF tools
export const getPDFTools = () =>
  apiClient.get("/api/tools/pdf");

// Generate assignment help
export const generateAssignmentHelp = (payload) =>
  apiClient.post("/api/tools/assignment-help", payload);

