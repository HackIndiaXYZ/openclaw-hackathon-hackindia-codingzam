import apiClient from "./apiClient";

// Generate recommendations based on track and profile
export const generateRecommendations = (payload) =>
  apiClient.post("/api/recommendations", payload);

