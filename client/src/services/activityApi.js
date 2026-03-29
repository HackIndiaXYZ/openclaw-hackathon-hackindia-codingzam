import apiClient from "./apiClient";

export const getActivity = () => apiClient.get("/api/activity");

export const syncActivity = (activity) =>
  apiClient.put("/api/activity/sync", { activity });

export const sendOpportunityAction = (payload) =>
  apiClient.post("/api/activity/opportunity-action", payload);
