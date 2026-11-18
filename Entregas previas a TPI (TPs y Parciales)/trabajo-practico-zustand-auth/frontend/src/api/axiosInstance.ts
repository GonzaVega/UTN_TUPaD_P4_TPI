import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const url = error.config?.url || "";
      const status = error.response?.status;
      const isAuthPath = url.includes("/auth/token") || url.includes("/auth/login") || url.includes("/auth/me");

      if (status === 401 && !isAuthPath) {
        useAuthStore.getState().clearSession();
      }
    }
    return Promise.reject(error);
  }
);

