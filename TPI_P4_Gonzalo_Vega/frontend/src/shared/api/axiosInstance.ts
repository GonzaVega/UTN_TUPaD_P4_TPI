import axios from "axios";
import { useAuthStore } from "../../store/authStore";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const url = error.config?.url || "";
      const status = error.response?.status;
      const detail = error.response?.data?.detail;

      const isAuthPath = url.includes("/auth/token") || url.includes("/auth/me");

      if (status === 401 && !isAuthPath) {
        useAuthStore.getState().clearSession();
      } else if (
        status === 400 &&
        typeof detail === "string" &&
        detail.includes("Cuenta de usuario desactivada")
      ) {
        useAuthStore.getState().clearSession();
      }
    }
    return Promise.reject(error);
  }
);

