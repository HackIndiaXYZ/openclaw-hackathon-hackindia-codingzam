import apiClient from "./apiClient";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetryAuth = (error) => {
  if (!error) {
    return false;
  }

  // Axios timeout and generic network failures should be retried once.
  return error.code === "ECONNABORTED" || !error.response;
};

const postAuthWithRetry = async (path, payload) => {
  try {
    return await apiClient.post(path, payload);
  } catch (error) {
    if (!shouldRetryAuth(error)) {
      throw error;
    }

    await wait(1200);
    return apiClient.post(path, payload);
  }
};

// Create account request.
export const signupUser = (payload) => postAuthWithRetry("/api/auth/signup", payload);

// Login request.
export const loginUser = (payload) => postAuthWithRetry("/api/auth/login", payload);

