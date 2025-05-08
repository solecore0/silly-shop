import axios from "axios";
import { setupAxiosInterceptors } from "./tokenRefresh";
import config from "../config";

const api = axios.create({
  baseURL: config.API_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

setupAxiosInterceptors(api);

export default api;
