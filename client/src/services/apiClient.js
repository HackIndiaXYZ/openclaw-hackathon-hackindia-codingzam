import axios from "axios";

const normalizeBaseUrl = (url) => {
  if (!url) {
    return "";
  }

  return String(url)
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");
};

const API_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) ||
  "https://openclaw-hackathon-hackindia-codingzam.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 15000),
});

let activeRequests = 0;
const loadingListeners = new Set();

const notifyLoadingListeners = () => {
  const isLoading = activeRequests > 0;
  loadingListeners.forEach((listener) => listener(isLoading));
};

const startLoading = () => {
  activeRequests += 1;
  notifyLoadingListeners();
};

const stopLoading = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  notifyLoadingListeners();
};

// Expose loading state updates so a global loader can react to API activity.
export const subscribeToGlobalLoading = (listener) => {
  loadingListeners.add(listener);
  listener(activeRequests > 0);

  return () => {
    loadingListeners.delete(listener);
  };
};

apiClient.interceptors.request.use(
  (config) => {
    startLoading();

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error) => {
    stopLoading();

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default apiClient;

