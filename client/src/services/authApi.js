import apiClient from "./apiClient";

// Create account request.
export const signupUser = (payload) => apiClient.post("/api/auth/signup", payload);

// Login request.
export const loginUser = (payload) => apiClient.post("/api/auth/login", payload);

