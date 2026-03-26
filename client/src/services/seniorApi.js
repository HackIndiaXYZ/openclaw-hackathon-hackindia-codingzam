import apiClient from "./apiClient";

// Get all seniors/mentors
export const fetchSeniors = () =>
  apiClient.get("/api/seniors");

// Register as a mentor
export const registerAsMentor = (payload) =>
  apiClient.post("/api/seniors/register", payload);

