import api from "./api";

let refreshPromise = null;

export const setupAxiosInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (!refreshPromise) {
          refreshPromise = api
            .get("/user/refresh-token")
            .then((res) => res.data.accessToken)
            .finally(() => {
              refreshPromise = null;
            });
        }

        try {
          const newToken = await refreshPromise;
          localStorage.setItem("token", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          originalRequest._retry = true;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
