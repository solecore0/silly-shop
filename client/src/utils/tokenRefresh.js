import axios from "axios";
import api from "./api";
import config from "../config";

let refreshPromise = null;

// Create a separate instance for refresh token requests
const refreshClient = axios.create({
  baseURL: config.API_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const setupAxiosInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .get("/user/refresh-token")
            .then((res) => res.data.accessToken)
            .catch((err) => {
              // Clear everything on refresh token failure
              localStorage.removeItem("token");
              // Only redirect if we're not already on the login page
              if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
              }
              return Promise.reject(err);
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        try {
          const newToken = await refreshPromise;
          // Update token in localStorage
          localStorage.setItem("token", newToken);
          // Update the failed request's authorization header
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          originalRequest._retry = true;
          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
